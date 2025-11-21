import { getStatus, getTotalVotes } from '$lib/sqliteClient';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
	let intervalId: NodeJS.Timeout;

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			let isClosed = false;

			// Send initial data
			const sendUpdate = () => {
				// Check if controller is closed before sending
				if (isClosed) {
					return;
				}

				try {
					const status = getStatus(event);
					const nbVotes = getTotalVotes(event);

					const data = JSON.stringify({ status, nbVotes });
					controller.enqueue(encoder.encode(`data: ${data}\n\n`));
				} catch (error) {
					// Only log if it's not a closed controller error
					if (!isClosed) {
						console.error('Error sending SSE update:', error);
					}
				}
			};

			// Send immediately
			sendUpdate();

			// Send updates every 2 seconds
			intervalId = setInterval(sendUpdate, 2000);

			// Mark as closed when stream is cancelled
			return () => {
				isClosed = true;
			};
		},
		cancel() {
			// Clean up interval when client disconnects
			if (intervalId) {
				clearInterval(intervalId);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
};
