import {
  TableBody,
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../ui/table";

const bagsSizes = [
  {
    type: "Backpack",
    small: "15 x 10 x 5",
    medium: "18 x 12 x 6",
    large: "20 x 14 x 8",
  },
  {
    type: "Tote Bag",
    small: "12 x 14 x 4",
    medium: "14 x 16 x 5",
    large: "16 x 18 x 6",
  },
  {
    type: "Crossbody",
    small: "8 x 10 x 3",
    medium: "10 x 12 x 4",
    large: "12 x 14 x 5",
  },
];

export default function SizeBags() {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Bags Size Guide</h2>
      <p className="mb-4">
        Dimensions are in inches (Height x Width x Depth). This is approximate;
        refer to product specs.
      </p>
      <Table>
        <TableCaption>Bags Size Guide</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Small</TableHead>
            <TableHead>Medium</TableHead>
            <TableHead>Large</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bagsSizes.map((bag, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{bag.type}</TableCell>
                <TableCell>{bag.small}</TableCell>
                <TableCell>{bag.medium}</TableCell>
                <TableCell>{bag.large}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
