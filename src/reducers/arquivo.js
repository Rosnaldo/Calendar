import { today, monthCurr, yearCurr, dateFormat, sunSemana } from '../services/Dates';

const INITIAL_STATE = {
  json: {
    [dateFormat(today, monthCurr, yearCurr)]: [
      {
        "6fwa-efw3457b-45b2-bd6b-cefef34w32c": {
          top: 60,
          height: 19,
          color: "rgb(63, 113, 252)",
          input: { name: "diario2", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
        "6981837a-ef7b-45b2-bd6b-c7a638abbd2c": {
          top: 18.4,
          height: 30,
          color: "rgb(63, 113, 252)",
          input: { name: "diario", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
        "6fwfw37a-ef7b-45b2-bd6b-c7fwefew8232c": {
          top: 40,
          height: 30,
          color: "rgb(63, 113, 252)",
          input: { name: "diario2", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
      },
      {
        "6fwa-35b-45b2-b38jvr-b-c477-32c": {
          top: 18,
          height: 19,
          color: "rgb(63, 113, 252)",
          input: { name: "coisa", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
      },
      {},
      {},
      {},
    ],
    "11/May/2020" : [
      {
        "6fwa-35b-45b2-bd6b-ce435232c": {
          top: 18,
          height: 19,
          color: "rgb(63, 113, 252)",
          input: { name: "coisa", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
      },
      {
        "6fwa-35b-45b2-bd6b-c477-32c": {
          top: 18,
          height: 19,
          color: "rgb(63, 113, 252)",
          input: { name: "coisa", horario: "7h ~ 9h", endereco: "rua Josué" },
        },
      },
      {},
      {},
      {},
    ],
  },
  related: {
    semanal: {
      "7d3f95bd-5265-4a24-a263-4ae1961fc23e": [dateFormat(today, monthCurr, yearCurr), "1", {
        top: 18.4,
        height: 19,
        input: { name: "semanal", horario: "7h ~ 9h", endereco: "rua Josué" },
      },
      dateFormat(today + 7, monthCurr, yearCurr),
    ],
    },
    quinzenal: {
      "7d3reted-5265-4a24-a263-ubeyf7667ef": [dateFormat(20, 3, yearCurr), "2", {
        top: 18.4,
        height: 19,
        input: { name: "quinzenal", horario: "7h ~ 9h", endereco: "rua Josué" },
      }],
    },
    mensal: {
      "huefw76-5265-4a24-wfew-456hty89fe": [dateFormat(today, monthCurr - 1, yearCurr), "3", {
        top: 18.4,
        height: 19,
        input: { name: "mensal", horario: "7h ~ 9h", endereco: "rua Josué" },
      }],
    },
  }
};

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'load') {
    const json = { ...action.json } ;
    return {
      ...state, json,
    }
  }
  if (action.type === 'related') {
    const related = { ...action.related } ;
    return {
      ...state, related,
    }
  }
  return state;
};
