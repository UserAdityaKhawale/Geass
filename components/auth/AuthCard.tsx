import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="text-sm leading-7 text-neutral-300 sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4 py-1">{children}</div>
    </div>
  );
};

export default AuthCard;
