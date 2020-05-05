export default class Elems {
  static elements() {
    return Elems.array[0].querySelectorAll('.elem');
  }

  static json(json, dateFormatted) {
    for (let i = 0; i < 5; i += 1) {
      const servicos = Elems.elements()[i].querySelectorAll('.servico');
      servicos.forEach((servico) => {
        const inputs = servico.querySelectorAll('input');
        const horario = inputs[0].value;
        const name = inputs[1].value;
        const endereco = inputs[2].value;
        const input = { name, horario, endereco };
        const id = servico.getAttribute('id');
        const top = Elems.convert(servico.getBoundingClientRect().top);
        const height = Elems.convert(servico.getBoundingClientRect().height);
        const color = window.getComputedStyle(servico)
          .getPropertyValue('background-color') ;
        json[dateFormatted][i][id] = { top, height, color, input };
      });
    }
    return json;
  }

  static updateRelateds(related) {
    for (let i = 0; i < 5; i += 1) {
      const servicos = Elems.elements()[i].querySelectorAll('.servico');
      servicos.forEach((servico) => {
        const inputs = servico.querySelectorAll('input');
        const horario = inputs[0].value;
        const name = inputs[1].value;
        const endereco = inputs[2].value;
        const input = { name, horario, endereco };
        const id = servico.getAttribute('id');
        const top = Elems.convert(servico.getBoundingClientRect().top);
        const height = Elems.convert(servico.getBoundingClientRect().height);
        const color = window.getComputedStyle(servico)
          .getPropertyValue('background-color');
          Elems.selectColor(color, related, id, { top, height, input });
        });
      }
    return related;
  }

  static selectColor(color, related, id, obj) {
    switch(color) {
      case 'rgb(63, 113, 252)':
        break;
      case 'rgb(40, 145, 55)':
        related['semanal'][id][2] = obj;
        break;
      case 'rgb(51, 69, 98)':
        related['quinzenal'][id][2] = obj;
        break;
      case 'rgb(192, 36, 98)':
        related['mensal'][id][2] = obj;
        break;
      default:
        break;
    }
  }

  static findById(id) {
    for (let i = 0; i < 5; i += 1) {
      const servicos = Elems.elements()[i].querySelectorAll('.servico');
      for (let j = 0; j < servicos.length; j += 1) {
        if (id === servicos[j].getAttribute('id')) {
          const inputs = servicos[j].querySelectorAll('input');
          const horario = inputs[0].value;
          const name = inputs[1].value;
          const endereco = inputs[2].value;
          const input = { name, horario, endereco };
          const top = Elems.convert(servicos[j].getBoundingClientRect().top);
          const height = Elems.convert(servicos[j].getBoundingClientRect().height);
          return { input, top, height };
        }
      }
    }
    return null;
  }

  static discardRelated(json, related, dateFormatted) {
    const { semanal, quinzenal, mensal } = related;
    const ids = [...Object.keys(semanal), ...Object.keys(quinzenal), ...Object.keys(mensal)];
    for (let i = 0; i < 5; i += 1) {
      Object.keys(json[dateFormatted][i]).forEach((key) => {
        if (ids.some((id) => id === key)) {
          delete json[dateFormatted][i][key];
        }
      });
    }
    return json;
  }

  static convert(px){
    return (parseFloat(px) * 100) / window.innerHeight;
  }
}
