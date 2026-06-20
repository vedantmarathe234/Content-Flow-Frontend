import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ContentDetailsPage from "./ContentDetailsPage";

const DirectReviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contentId = searchParams.get("contentId");

  if (!contentId) {
    return (
      <div className="p-8 text-slate-500 font-semibold">
        Invalid or missing content reference ID.
      </div>
    );
  }

  const handleClose = () => {
    navigate("/user/dashboard", { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 relative">
      <div className="text-slate-400 text-sm font-medium">
        Loading deep link content review workspace...
      </div>

      <ContentDetailsPage 
        id={Number(contentId)} 
        onClose={handleClose} 
        onRefresh={() => console.log("Refreshed direct view")} 
      />
    </div>
  );
};

export default DirectReviewPage;