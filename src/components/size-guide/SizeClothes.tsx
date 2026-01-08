import {
  TableBody,
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../ui/table";

const womanClothSizes = [
  {
    size: "XS",
    bust: "30-32",
    waist: "23-25",
    hips: "33-35",
  },
  {
    size: "S",
    bust: "32-34",
    waist: "25-27",
    hips: "35-37",
  },
  {
    size: "M",
    bust: "34-36",
    waist: "27-29",
    hips: "37-39",
  },
  {
    size: "L",
    bust: "36-38",
    waist: "29-31",
    hips: "39-41",
  },
  {
    size: "XL",
    bust: "38-40",
    waist: "31-33",
    hips: "41-43",
  },
];

const menClothSizes = [
  {
    size: "XS",
    bust: "32-34",
    waist: "26-28",
    hips: "33-35",
  },
  {
    size: "S",
    bust: "34-36",
    waist: "28-30",
    hips: "35-37",
  },
  {
    size: "M",
    bust: "38-40",
    waist: "32-34",
    hips: "37-39",
  },
  {
    size: "L",
    bust: "42-44",
    waist: "36-38",
    hips: "39-41",
  },
  {
    size: "XL",
    bust: "46-48",
    waist: "40-42",
    hips: "41-43",
  },
];

export default function SizeClothes() {
  return (
    <>
      <h2 className="text-xl text-center lg:text-left font-bold mb-2">
        Clothes Size Guide
      </h2>
      <p className="text-justify mb-4 lg:text-base text-sm">
        Measurements are in inches. This is a general guide; please check
        product details for exact fits.
      </p>
      <h3 className="text-lg font-semibold mb-2">{`Women's Clothing`}</h3>
      <Table>
        <TableCaption>Women Clothes Size Guides</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Bust</TableHead>
            <TableHead>Waist</TableHead>
            <TableHead>Hips</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {womanClothSizes.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.bust}</TableCell>
                <TableCell>{item.waist}</TableCell>
                <TableCell>{item.hips}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <h3 className="text-lg font-semibold mb-2">{`Men's Clothing`}</h3>
      <Table>
        <TableCaption>Men Clothes Size Guides</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Chest</TableHead>
            <TableHead>Waist</TableHead>
            <TableHead>Hips</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menClothSizes.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.bust}</TableCell>
                <TableCell>{item.waist}</TableCell>
                <TableCell>{item.hips}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
