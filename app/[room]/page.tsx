

"use client"



export default function Page({params}:{params: {slug: string}}){
  //const[slug,setSlug] = useSate("")
  return(
  <div>
      <h1 className="font-4xl bg-red">This is the room page
        <p className="text-2xl bg-blue-200">{params.slug}</p>
      </h1>
  </div>
  )
}
