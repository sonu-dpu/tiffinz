"use client"

import { IUser } from '@/models/user.model'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { useQuery } from '@tanstack/react-query'
import Loader from '../ui/Loader'
import { PaymentStatus } from '@/constants/enum'
import { getRequests } from '@/helpers/client/add-balance'
import { Button } from '../ui/button'
import Link from 'next/link'
import ExampleCharts from '../example-chart'


function AdminDashboard({ user }: { user: IUser }) {
    return (
        <div>
            <div>Welcome {user.fullName}</div>
            <div className='flex justify-center flex-wrap gap-2'>
                <RequestCountCard></RequestCountCard>
            <ExampleCharts/>
            </div>

        </div>
    )
}
export async function getRequestsCount(status?: PaymentStatus) {
    return getRequests({ status, count: true });
}
export function RequestCountCard() {
    const {
        data,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["getPendingRequestsCount", PaymentStatus.pending],
        queryFn: () => getRequestsCount(PaymentStatus.pending),
    });

    return (
        <Card className="w-full max-w-sm rounded-2xl shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Pending Requests
                </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-center py-6">
                {isFetching ? (
                    <Loader />
                ) : error instanceof Error ? (
                    <p className="text-sm text-red-500">{error.message}</p>
                ) : (
                    <p className="text-3xl font-bold text-primary">
                        {data?.count ?? 0}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button asChild variant="outline">
                    <Link href={"/dashboard/requests"}>View Requests</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}


export default AdminDashboard