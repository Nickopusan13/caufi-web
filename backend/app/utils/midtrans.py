from fastapi import HTTPException, status
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
from app.schemas.order import OrderOut
from typing import Dict
import midtransclient
import os

load_dotenv()

snap = midtransclient.Snap(
    is_production=os.getenv("MIDTRANS_IS_PRODUCTION", "false").lower() == "true",
    server_key=os.getenv("MIDTRANS_SERVER_KEY"),
)


def build_midtrans_customer_details(order_out: OrderOut) -> Dict:
    user = order_out.user
    addr = order_out.address
    full_name = user.name.strip()
    name_parts = full_name.split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    phone = (user.phone_number or "081234567890").replace("-", "").replace(" ", "")
    address_line = addr.address_line1
    if addr.address_line2:
        address_line += f", {addr.address_line2}"
    address_block = {
        "first_name": first_name,
        "last_name": last_name,
        "address": address_line,
        "city": addr.city,
        "postal_code": addr.postal_code,
        "phone": phone,
        "country_code": "IDN",
    }
    return {
        "first_name": first_name,
        "last_name": last_name,
        "email": user.email,
        "phone": phone,
        "billing_address": address_block,
        "shipping_address": address_block,
    }


def build_midtrans_item_details(order_out: OrderOut) -> list[dict]:
    items = []
    for item in order_out.items:
        items.append(
            {
                "id": f"ITEM-{item.product_id}-{order_out.id}",
                "price": int(item.price_at_purchase),
                "quantity": item.quantity,
                "name": (item.name or "Product")[:50],
                "brand": "Caufi",
                "category": "Fashion",
                "merchant_name": "Caufi Store",
            }
        )
    return items


def create_midtrans_transaction(order_out: OrderOut):
    gross_amount = int(float(order_out.total_amount))
    order_id = f"CAUFI-{order_out.id}-{int(datetime.now().timestamp())}"
    param = {
        "transaction_details": {"order_id": order_id, "gross_amount": gross_amount},
        "item_details": build_midtrans_item_details(order_out),
        "customer_details": build_midtrans_customer_details(order_out),
        "enabled_payments": [
            "gopay",
            "shopeepay",
            "credit_card",
            "bca_va",
            "bni_va",
            "bri_va",
            "cimb_va",
            "permata_va",
            "indomaret",
            "alfamart",
        ],
        "credit_card": {"secure": True},
        "callbacks": {
            "finish": f"https://caufi.nickopusan.dev/order/success?order_id={order_out.id}",
            "error": f"https://caufi.nickopusan.dev/order/failed?order_id={order_out.id}",
            "pending": f"https://caufi.nickopusan.dev/order/pending?order_id={order_out.id}",
        },
        "expiry": {
            "start_time": datetime.now(tz=timezone(timedelta(hours=7))).strftime("%Y-%m-%d %H:%M:%S %z"),
            "unit": "day",
            "duration": 1,
        },
    }
    try:
        transaction = snap.create_transaction(param)
        return {
            "order_id": order_id,
            "midtrans_order_id": transaction.get("order_id"),
            "token": transaction["token"],
            "redirect_url": transaction["redirect_url"],
            "expires_at": param["expiry"]["start_time"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Midtrans error: {str(e)}"
        )
