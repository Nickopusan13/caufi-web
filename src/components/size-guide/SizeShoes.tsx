import {
  TableBody,
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../ui/table";

const womenShoesSizes = [
  {
    us: "5",
    eu: "35-36",
    uk: "3",
    footLength: "8.5",
  },
  {
    us: "6",
    eu: "36-37",
    uk: "4",
    footLength: "8.9",
  },
  {
    us: "7",
    eu: "37-38",
    uk: "5",
    footLength: "9.3",
  },
  {
    us: "8",
    eu: "38-39",
    uk: "6",
    footLength: "9.5",
  },
  {
    us: "9",
    eu: "39-40",
    uk: "7",
    footLength: "9.9",
  },
];

const menShoesSizes = [
  {
    us: "7",
    eu: "40",
    uk: "6.5",
    footLength: "9.6",
  },
  {
    us: "8",
    eu: "41",
    uk: "7.5",
    footLength: "9.9",
  },
  {
    us: "9",
    eu: "42",
    uk: "8.5",
    footLength: "10.3",
  },
  {
    us: "10",
    eu: "43",
    uk: "9.5",
    footLength: "10.6",
  },
  {
    us: "11",
    eu: "44",
    uk: "10.5",
    footLength: "10.9",
  },
];

export default function SizeShoes() {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Shoes Size Guide</h2>
      <p className="mb-4">
        International shoe size conversions. Measure your foot length in inches
        for best fit.
      </p>
      <h3 className="text-lg font-semibold mb-2">{`Women's Shoes`}</h3>
      <Table>
        <TableCaption>{`Women's Shoes Size Guide`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>US</TableHead>
            <TableHead>EU</TableHead>
            <TableHead>UK</TableHead>
            <TableHead>Foot Length (inches)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {womenShoesSizes.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{item.us}</TableCell>
                <TableCell>{item.eu}</TableCell>
                <TableCell>{item.uk}</TableCell>
                <TableCell>{item.footLength}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <h3 className="text-lg font-semibold mb-2">{`Men's Shoes`}</h3>
      <Table>
        <TableCaption>{`Men's Shoes Size Guide`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>US</TableHead>
            <TableHead>EU</TableHead>
            <TableHead>UK</TableHead>
            <TableHead>Foot Length (inches)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menShoesSizes.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{item.us}</TableCell>
                <TableCell>{item.eu}</TableCell>
                <TableCell>{item.uk}</TableCell>
                <TableCell>{item.footLength}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
