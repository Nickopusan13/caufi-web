"use client";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import Richtext from "../../richtext/Richtext";

export default function BlogContent({
  value,
  onChange,
  blogId,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  blogId?: number | null;
  placeholder: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Richtext
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          blogId={blogId}
        />
      </CardContent>
    </Card>
  );
}
