// Placeholder error middleware
export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
	res.status(500).json({ error: err.message || 'Internal Server Error' });
};
