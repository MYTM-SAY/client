import React from "react";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>hi iam layout</div> {children}
    </section>
  );
}
