"use client";

import { Card, CardTitle, CardHeader } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Search, Plus } from "lucide-react";

export default function CardHeaderAdmin({
  headTitle,
  href,
  hrefTitle,
}: {
  headTitle: string;
  href: string;
  hrefTitle: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-3xl font-bold">{headTitle}</CardTitle>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Export
            </Button>
            <Button
              asChild
              className="gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link href={href}>
                <Plus className="h-4 w-4" />
                {hrefTitle}
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
