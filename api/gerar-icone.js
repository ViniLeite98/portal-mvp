export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).end();

  console.log("API KEY:", process.env.ANTHROPIC_API_KEY ? "EXISTS" : "UNDEFINED");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  console.log("Status:", response.status);
  res.status(response.status).json(data);
}
