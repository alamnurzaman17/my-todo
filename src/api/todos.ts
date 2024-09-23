import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { page = 1, limit = 10 } = req.query;
    const start = (Number(page) - 1) * Number(limit);

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${limit}`);
    const todos = await response.json();
    const totalCount = response.headers.get("x-total-count");

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
    res.status(200).json({ todos, totalCount });
}