interface StaticBoxProps {
  title: string;
  value: number;
}

export default function StaticBox({ title, value }: StaticBoxProps) {
  return (
    <div className="flex h-48 w-48 flex-col items-center justify-center rounded-lg bg-[#C94242] p-4 text-white">
      <h1 className="text-center text-sm font-bold">{title}</h1>
      <h1 className="mt-4 text-center text-3xl font-bold">{value}</h1>
    </div>
  );
}
