import { NextResponse } from "next/server";
/*TODO : We should update this with our email provider , once we have one */
/* 
Method : POST 
Path: /api/contact
*/
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Data received from frontend:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
