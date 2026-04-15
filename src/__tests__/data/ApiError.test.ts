import { ApiError } from '@/data/ApiError';

describe('ApiError', () => {
  it('expone status y body opcional', () => {
    const e = new ApiError({ status: 400, body: { x: 1 }, serverMessage: 'bad' });
    expect(e.message).toBe('HTTP 400');
    expect(e.status).toBe(400);
    expect(e.body).toEqual({ x: 1 });
    expect(e.serverMessage).toBe('bad');
    expect(e.name).toBe('ApiError');
  });
});
