import { ApiError } from '@/data/errors/ApiError';

describe('ApiError', () => {
  it('expone status y body opcional', () => {
    const e = new ApiError('msg', 400, { x: 1 });
    expect(e.message).toBe('msg');
    expect(e.status).toBe(400);
    expect(e.body).toEqual({ x: 1 });
    expect(e.name).toBe('ApiError');
  });
});
