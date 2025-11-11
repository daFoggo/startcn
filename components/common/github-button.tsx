"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { SITE_CONFIG } from "@/configs/site";
import { useGithubStarsStore } from "@/hooks/use-github-stars";
import { formatCompactNumber } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { GithubDark } from "../ui/svgs/githubDark";
import { GithubLight } from "../ui/svgs/githubLight";

export const GithubButton = () => {
  const { theme } = useTheme();
  const { stargazersCount, isLoading, error, fetchGithubStars } =
    useGithubStarsStore();

  useEffect(() => {
    fetchGithubStars(SITE_CONFIG.author.name, SITE_CONFIG.github.name);
  }, [fetchGithubStars]);

  const onClickButton = () => {
    window.open(SITE_CONFIG.github.url, "_blank");
  };

  if (isLoading) {
    return <Skeleton className="rounded-md w-12 h-7" />;
  }

  if (!isLoading && error) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" onClick={onClickButton}>
      {theme === "light" ? <GithubLight /> : <GithubDark />}
      <span>{formatCompactNumber(stargazersCount)}</span>
    </Button>
  );
};
