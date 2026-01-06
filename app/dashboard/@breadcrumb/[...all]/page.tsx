import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBreadcrumbLabel } from "@/lib/breadcrumb-mapping";
import Link from "next/link";
import type { ReactElement } from "react";
import React from "react";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ all: string[] }>;
}) {
  const { all } = await params;
  const breadcrumbItems: ReactElement[] = [];
  let breadcrumbPage: ReactElement = <></>;

  const rootHref = "/dashboard";

  for (let i = 0; i < all.length; i++) {
    const route = all[i];
    const label = getBreadcrumbLabel(route);
    const href = `${rootHref}/${all.slice(0, i + 1).join("/")}`;

    if (i === all.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">{label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </React.Fragment>
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
