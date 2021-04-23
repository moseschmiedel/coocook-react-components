enum MaybeType {
    Just = "maybe-type__just",
    Nothing = "maybe-type__nothing",
}

export interface Just<T> {
    type: typeof MaybeType.Just;
    value: T;
}

export interface Nothing {
    type: typeof MaybeType.Nothing;
}

export type Maybe<T> = Just<T> | Nothing;

export const Nothing = (): Nothing => ({
    type: MaybeType.Nothing,
});

export const Just = <T>(value: T): Just<T> => ({
    type: MaybeType.Just,
    value,
});

function maybeMap<A, B>(f: (val: A) => B, m: Maybe<A>): Maybe<B> {
    switch (m.type) {
        case MaybeType.Nothing:
            return Nothing();
        case MaybeType.Just:
            return Just(f(m.value));
    }
}

function maybeAndThen<A, B>(f: (val: A) => Maybe<B>, m: Maybe<A>): Maybe<B> {
    switch (m.type) {
        case MaybeType.Nothing:
            return Nothing();
        case MaybeType.Just:
            return f(m.value);
    }
}

function maybeOf<T>(value: T): Maybe<T> {
    return value === undefined || value === null ? Nothing() : Just(value);
}

function maybeWithDefault<T>(defaultVal: T, m: Maybe<T>): T {
    switch (m.type) {
        case MaybeType.Nothing:
            return defaultVal;
        case MaybeType.Just:
            return m.value;
    }
}

export const MaybeUtils = {
    andThen: maybeAndThen,
    map: maybeMap,
    of: maybeOf,
    withDefault: maybeWithDefault,
};
