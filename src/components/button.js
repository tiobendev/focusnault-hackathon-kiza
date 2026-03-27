import Link from "next/link";

export default function ButtonDefault({ textButton, href }) {
  return (
    <>
        <Link className="bg-[#5E689F] hover:bg-indigo-400 text-white w-80 px-26 py-3 rounded-md" href={href}>{textButton}</Link>
    </>
  );
}
