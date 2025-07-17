// components/ui/pagination.tsx
"use client";

import { generatePagination } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <PaginationLink
          href={createPageURL(currentPage - 1)}
          disabled={currentPage <= 1}
          direction="prev"
        />
        <PaginationLink
          href={createPageURL(currentPage + 1)}
          disabled={currentPage >= totalPages}
          direction="next"
          className="ml-3"
        />
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <nav className="flex items-center space-x-2">
          <PaginationLink
            href={createPageURL(currentPage - 1)}
            disabled={currentPage <= 1}
            direction="prev"
            variant="outline"
          />

          <div className="flex items-center space-x-1">
            {allPages.map((page, index) => (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                isActive={currentPage === page}
              />
            ))}
          </div>

          <PaginationLink
            href={createPageURL(currentPage + 1)}
            disabled={currentPage >= totalPages}
            direction="next"
            variant="outline"
          />
        </nav>
      </div>
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  const isEllipsis = page === "...";
  const className = clsx(
    "relative inline-flex items-center justify-center text-sm font-medium transition-colors",
    "h-9 w-9 rounded-md",
    {
      "bg-primary text-primary-foreground shadow hover:bg-primary/90": isActive,
      "text-foreground hover:bg-accent hover:text-accent-foreground":
        !isActive && !isEllipsis,
      "text-muted-foreground cursor-default": isEllipsis,
      "border border-input": !isActive,
    }
  );

  return isEllipsis ? (
    <span className={className}>
      <FiMoreHorizontal className="h-4 w-4" />
    </span>
  ) : (
    <Link
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </Link>
  );
}

function PaginationLink({
  href,
  disabled,
  direction,
  className = "",
  variant = "default",
}: {
  href: string;
  disabled: boolean;
  direction: "prev" | "next";
  className?: string;
  variant?: "default" | "outline";
}) {
  const baseClass = clsx(
    "relative inline-flex items-center justify-center text-sm font-medium transition-colors",
    "h-9 px-3 rounded-md",
    {
      "text-primary-foreground bg-primary shadow hover:bg-primary/90":
        variant === "default" && !disabled,
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground":
        variant === "outline" && !disabled,
      "text-muted-foreground cursor-not-allowed opacity-50": disabled,
      "cursor-pointer": !disabled,
    },
    className
  );

  const icon =
    direction === "prev" ? (
      <FiChevronLeft className="h-4 w-4" />
    ) : (
      <FiChevronRight className="h-4 w-4" />
    );

  const text = direction === "prev" ? "Previous" : "Next";

  return disabled ? (
    <span className={baseClass} aria-disabled="true">
      {icon}
      <span className="sr-only">{text}</span>
    </span>
  ) : (
    <Link href={href} className={baseClass} aria-disabled={disabled}>
      {variant === "outline" ? icon : text}
      <span className="sr-only">{text}</span>
    </Link>
  );
}
