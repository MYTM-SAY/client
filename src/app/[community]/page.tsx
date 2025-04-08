import Forum from "@/components/Forum/forum"

export default function Page({ params }: { params: { community: string } }) {
  console.log(params)
  return <>
    <Forum />
  </>
}
