import { mapBadRequestBodyToFieldErrors } from '@/shared/utils/mapApiFieldErrors';

describe('mapBadRequestBodyToFieldErrors', () => {
  it('devuelve vacío para cuerpo inválido', () => {
    expect(mapBadRequestBodyToFieldErrors(null)).toEqual({});
    expect(mapBadRequestBodyToFieldErrors(undefined)).toEqual({});
    expect(mapBadRequestBodyToFieldErrors('x')).toEqual({});
  });

  it('mapea array class-validator y traduce mensajes', () => {
    const body = {
      errors: [
        {
          property: 'name',
          constraints: { minLength: 'must be longer than 5' },
        },
        {
          property: 'id',
          constraints: { isNotEmpty: 'should not be empty' },
        },
      ],
    };
    const out = mapBadRequestBodyToFieldErrors(body);
    expect(out.name).toMatch(/longitud mínima/);
    expect(out.id).toMatch(/obligatorio/);
  });

  it('mapea objeto errors alternativo', () => {
    const body = {
      errors: {
        description: ['must be shorter than 200'],
      },
    };
    const out = mapBadRequestBodyToFieldErrors(body);
    expect(out.description).toMatch(/longitud permitida/);
  });

  it('traduce restricciones de fecha y objeto con string directo', () => {
    const dateErr = {
      errors: [
        {
          property: 'date_release',
          constraints: { isDateString: 'must be a date string' },
        },
      ],
    };
    expect(mapBadRequestBodyToFieldErrors(dateErr).date_release).toMatch(/AAAA-MM-DD/);

    const strVal = {
      errors: {
        logo: 'must be a date string',
      },
    };
    expect(mapBadRequestBodyToFieldErrors(strVal).logo).toMatch(/AAAA-MM-DD/);
  });

  it('traduce isNotEmpty en array de errores', () => {
    const body = {
      errors: [{ property: 'description', constraints: { x: 'should not be empty' } }],
    };
    expect(mapBadRequestBodyToFieldErrors(body).description).toMatch(/obligatorio/);
  });
});
