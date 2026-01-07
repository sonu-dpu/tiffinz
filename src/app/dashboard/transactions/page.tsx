"use client";
import { TransactionItem } from "@/components/dashboard/transactions/UserTransactions";
import Loader from "@/components/ui/Loader";

import { UserRole } from "@/constants/enum";
import { getAllTransactions } from "@/helpers/client/admin.transactions";
import { getUserTransactions } from "@/helpers/client/user.transactions";

import useCurrentUser from "@/hooks/useCurrentUser";
import { ITransactionWithUser } from "@/models/transaction.model";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

function TransactionsPage() {
  const searchParams = useSearchParams();
  const { userRole } = useCurrentUser();
  const userId = searchParams.get("user") || "";

  const queryFn =
    userRole === UserRole.admin ? getAllTransactions : getUserTransactions;
  const { data, error, isFetching, fetchNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ["getAllTransactionsAdmin"],
      queryFn: ({ pageParam }) => queryFn({ pageParam, user: userId }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextPage) {
          return lastPage.page + 1;
        }
        return null;
      },
      getPreviousPageParam: (lastPage) => lastPage.hasPrevPage,
    });
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
    const element = loaderRef.current;
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [data, fetchNextPage]);
  let currentMonth = "";
  return status === "pending" ? (
    <Loader />
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      <div className="flex justify-center flex-col max-w-[600px] mx-auto">
        {data.pages.map((group) => {
          return group.docs.map((transaction: ITransactionWithUser) => {
            const month = getMonthFromDate(new Date(transaction.createdAt!));
            if (currentMonth !== month) {
              currentMonth = month;
              return (
                <React.Fragment key={String(transaction._id)}>
                  <div className="text-left bg-accent py-2 px-4 mt-6 rounded-xl font-semibold text-shadow-muted-foreground text-xl">
                    {currentMonth}
                  </div>
                  <TransactionItem
                    transaction={transaction}
                    key={String(transaction._id)}
                  />
                </React.Fragment>
              );
            }
            return (
              <TransactionItem
                transaction={transaction}
                key={String(transaction._id)}
              />
            );
          });
        })}
        <div
          ref={loaderRef}
          className="mx-auto mt-4 p-4 flex justify-center text-muted-foreground"
        >
          {isFetching ? <Loader /> : hasNextPage ? "" : "No more transactions"}
        </div>
      </div>
    </>
  );
}

function getMonthFromDate(date: Date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
}

export default TransactionsPage;
