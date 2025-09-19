import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  {
    name: "Emily Carter",
    role: "Teacher",
    course: "Introduction to Programming",
    date: "2024-07-26",
  },
  {
    name: "David Lee",
    role: "Teacher",
    course: "Data Science Fundamentals",
    date: "2024-07-25",
  },
  {
    name: "Sarah Jones",
    role: "Teacher",
    course: "Web Development Basics",
    date: "2024-07-24",
  },
  {
    name: "Programming Fundamentals",
    role: "Course",
    course: "Emily Carter",
    date: "2024-07-26",
  },
  {
    name: "Advanced Data Analysis",
    role: "Course",
    course: "David Lee",
    date: "2024-07-25",
  },
]

export function DataTable() {
  return (
    <Table>
      <TableCaption>So‘nggi qo‘shilgan o‘qituvchilar va kurslar</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nomi</TableHead>
          <TableHead>Roli</TableHead>
          <TableHead>Kurs</TableHead>
          <TableHead>Qo‘shilgan sana</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.role}</TableCell>
            <TableCell>{item.course}</TableCell>
            <TableCell>{item.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
