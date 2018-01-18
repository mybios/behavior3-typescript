export const VERSION = '0.2.3';

export enum STATE {
    NONE = 0,
    SUCCESS = 1,
    FAILURE = 2,
    RUNNING = 3,
    ERROR = 4,
}

export const SUCCESS = STATE.SUCCESS;
export const FAILURE = STATE.FAILURE;
export const RUNNING = STATE.RUNNING;
export const ERROR = STATE.ERROR;

export enum Category {
    COMPOSITE = 'composite',
    DECORATOR = 'decorator',
    ACTION = 'action',
    CONDITION = 'condition',
    NONE = '',
}

export const COMPOSITE = Category.COMPOSITE;
export const DECORATOR = Category.DECORATOR;
export const ACTION = Category.ACTION;
export const CONDITION = Category.CONDITION;
