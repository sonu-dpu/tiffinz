"use client";

import BalanceRequestCard from "@/components/dashboard/admin/requests/BalanceRequestCard";
import { useParams } from "next/navigation";
import React from "react";

function RequestApprovalPage() {
    const {id: reqId} = useParams()
    return <div>
        <BalanceRequestCard reqId={String(reqId)} />
    </div>;
}

export default RequestApprovalPage;
