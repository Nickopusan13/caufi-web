import Richtext from "@/components/admin/richtext/Richtext";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export default function ProductDescriptionContent({
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
        <CardTitle>Description</CardTitle>
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
