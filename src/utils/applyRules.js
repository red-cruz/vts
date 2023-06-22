import Vts from '../vts';
import log from './log';
import getLabel from './getLabel';
import vtsDefaults from '../defaults';

export default class rulesUtil {
  /**
   * @description
   * @author RED
   * @static
   * @param {Vts} Vts
   * @returns {Array<invalidTitle, invalidMessage>}
   * @memberof rulesUtil
   */
  static apply() {
    /** @type {Vts} */
    const Vts = this;
    const form = Vts.form;
    const field = Vts.currentField;
    const rule = Vts.config.rules[field.name];
    const label = getLabel(form, field);
    let title = 'Invalid ' + label;
    let message = field.validationMessage;
    let valid = true;

    // check if field has rule
    if (rule && field.checkValidity()) {
      title = rule.title ?? title;
      let pattern = rule.pattern;

      [valid = valid, message = message, pattern = pattern] =
        rulesUtil.#matchField.call(Vts, rule);

      const regExp = new RegExp(pattern, rule.flags);
      const source = regExp.source;

      if (regExp.test(field.value)) valid = true;

      log.show(Vts.config.log, 'log', 'pattern:', source);
    }
    return [valid, label, title, message];
  }
  /**
   * @description
   * @static
   * @param {Vts} Vts
   * @param {String} matchFieldName name of the field to match
   * @returns {[string, boolean]|[]}
   * @memberof rulesUtil
   */
  static #matchField(rule) {
    const matchFieldName = rule.match;

    if (!matchFieldName) return [];
    /** @type {Vts} */
    const Vts = this;
    const form = Vts.form;
    /** @type {HTMLInputElement} */
    const field = Vts.currentField;
    const matchTarget = form.querySelector('[name="' + matchFieldName + '"]');
    const defMismatchMsg =
      getLabel(form, field) + ' did not match ' + getLabel(form, matchTarget);
    /** @type {String} */
    const invalidMessage = rule.message || defMismatchMsg;
    const flags = rule.flags;
    const rawValue = matchTarget.value;
    const value = flags.includes('i')
      ? vtsDefaults.generateCaseCombinations(rawValue, flags)
      : rawValue;
    return [invalidMessage, value];
  }
}
