import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
}
const sfProDisplayStyle = {
  fontFamily: 'SF Pro Display, Arial, sans-serif',
  // marginLeft: '500px'
  // Add other inline styles as needed
};
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 style={sfProDisplayStyle} className="text-xl text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link style={sfProDisplayStyle} href="/home">
              Dashboard /
            </Link>
          </li>
          <li style={sfProDisplayStyle} className="text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
