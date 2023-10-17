import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
};

export default function PageLayout({ children, title }: Props) {
  return (
    <div className="relative flex flex-col grow py-36">
      <div className="container relative flex flex-col px-4 grow">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-800 md:text-5xl">
          {title}
        </h1>
        <div className="mt-6 text-gray-600 md:text-lg">{children}</div>
      </div>
    </div>
  );
}
