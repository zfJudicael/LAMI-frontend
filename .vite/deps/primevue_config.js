import {
  EventBus
} from "./chunk-7IMIA7S2.js";
import {
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  reactive,
  readonly,
  ref,
  watch
} from "./chunk-7H3D676B.js";

// node_modules/@primeuix/utils/object/index.mjs
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function isEmpty(value) {
  return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && typeof value === "object" && Object.keys(value).length === 0;
}
function isFunction(value) {
  return !!(value && value.constructor && value.call && value.apply);
}
function isNotEmpty(value) {
  return !isEmpty(value);
}
function isObject(value, empty = true) {
  return value instanceof Object && value.constructor === Object && (empty || Object.keys(value).length !== 0);
}
function resolve(obj, ...params) {
  return isFunction(obj) ? obj(...params) : obj;
}
function isString(value, empty = true) {
  return typeof value === "string" && (empty || value !== "");
}
function isArray(value, empty = true) {
  return Array.isArray(value) && (empty || value.length !== 0);
}
function isNumber(value) {
  return isNotEmpty(value) && !isNaN(value);
}
function matchRegex(str, regex) {
  if (regex) {
    const match = regex.test(str);
    regex.lastIndex = 0;
    return match;
  }
  return false;
}
function mergeKeys(...args) {
  const _mergeKeys = (target = {}, source = {}) => {
    const mergedObj = __spreadValues({}, target);
    Object.keys(source).forEach((key) => {
      if (isObject(source[key]) && key in target && isObject(target[key])) {
        mergedObj[key] = _mergeKeys(target[key], source[key]);
      } else {
        mergedObj[key] = source[key];
      }
    });
    return mergedObj;
  };
  return args.reduce((acc, obj, i) => i === 0 ? obj : _mergeKeys(acc, obj), {});
}
function minifyCSS(css3) {
  return css3 ? css3.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":") : css3;
}
function toKebabCase(str) {
  return isString(str) ? str.replace(/(_)/g, "-").replace(/[A-Z]/g, (c, i) => i === 0 ? c : "-" + c.toLowerCase()).toLowerCase() : str;
}
function toTokenKey(str) {
  return isString(str) ? str.replace(/[A-Z]/g, (c, i) => i === 0 ? c : "." + c.toLowerCase()).toLowerCase() : str;
}

// node_modules/@primeuix/styled/index.mjs
var __defProp2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var ThemeService = EventBus();
var service_default = ThemeService;
function merge(value1, value2) {
  if (isArray(value1)) {
    value1.push(...value2 || []);
  } else if (isObject(value1)) {
    Object.assign(value1, value2);
  }
}
function toValue(value) {
  return isObject(value) && value.hasOwnProperty("value") && value.hasOwnProperty("type") ? value.value : value;
}
function toUnit(value, variable = "") {
  const excludedProperties = ["opacity", "z-index", "line-height", "font-weight", "flex", "flex-grow", "flex-shrink", "order"];
  if (!excludedProperties.some((property) => variable.endsWith(property))) {
    const val = `${value}`.trim();
    const valArr = val.split(" ");
    return valArr.map((v) => isNumber(v) ? `${v}px` : v).join(" ");
  }
  return value;
}
function toNormalizePrefix(prefix) {
  return prefix.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function toNormalizeVariable(prefix = "", variable = "") {
  return toNormalizePrefix(`${isString(prefix, false) && isString(variable, false) ? `${prefix}-` : prefix}${variable}`);
}
function getVariableName(prefix = "", variable = "") {
  return `--${toNormalizeVariable(prefix, variable)}`;
}
function getVariableValue(value, variable = "", prefix = "", excludedKeyRegexes = [], fallback) {
  if (isString(value)) {
    const regex = /{([^}]*)}/g;
    const val = value.trim();
    if (matchRegex(val, regex)) {
      const _val = val.replaceAll(regex, (v) => {
        const path = v.replace(/{|}/g, "");
        const keys = path.split(".").filter((_v) => !excludedKeyRegexes.some((_r) => matchRegex(_v, _r)));
        return `var(${getVariableName(prefix, toKebabCase(keys.join("-")))}${isNotEmpty(fallback) ? `, ${fallback}` : ""})`;
      });
      const calculationRegex = /(\d+\s+[\+\-\*\/]\s+\d+)/g;
      const cleanedVarRegex = /var\([^)]+\)/g;
      return matchRegex(_val.replace(cleanedVarRegex, "0"), calculationRegex) ? `calc(${_val})` : _val;
    }
    return toUnit(val, variable);
  } else if (isNumber(value)) {
    return toUnit(value, variable);
  }
  return void 0;
}
function setProperty(properties, key, value) {
  if (isString(key, false)) {
    properties.push(`${key}:${value};`);
  }
}
function getRule(selector, properties) {
  if (selector) {
    return `${selector}{${properties}}`;
  }
  return "";
}
var dt = (...args) => {
  return dtwt(config_default.getTheme(), ...args);
};
var dtwt = (theme3 = {}, tokenPath, fallback, type = "variable") => {
  if (tokenPath) {
    const { variable: VARIABLE, options: OPTIONS } = config_default.defaults || {};
    const { prefix, transform } = (theme3 == null ? void 0 : theme3.options) || OPTIONS || {};
    const regex = /{([^}]*)}/g;
    const token = matchRegex(tokenPath, regex) ? tokenPath : `{${tokenPath}}`;
    const isStrictTransform = type === "value" || transform === "strict";
    return isStrictTransform ? config_default.getTokenValue(tokenPath) : getVariableValue(token, void 0, prefix, [VARIABLE.excludedKeyRegex], fallback);
  }
  return "";
};
function toVariables_default(theme3, options = {}) {
  const VARIABLE = config_default.defaults.variable;
  const { prefix = VARIABLE.prefix, selector = VARIABLE.selector, excludedKeyRegex = VARIABLE.excludedKeyRegex } = options;
  const _toVariables = (_theme, _prefix = "") => {
    return Object.entries(_theme).reduce(
      (acc, [key, value]) => {
        const px = matchRegex(key, excludedKeyRegex) ? toNormalizeVariable(_prefix) : toNormalizeVariable(_prefix, toKebabCase(key));
        const v = toValue(value);
        if (isObject(v)) {
          const { variables: variables2, tokens: tokens2 } = _toVariables(v, px);
          merge(acc["tokens"], tokens2);
          merge(acc["variables"], variables2);
        } else {
          acc["tokens"].push((prefix ? px.replace(`${prefix}-`, "") : px).replaceAll("-", "."));
          setProperty(acc["variables"], getVariableName(px), getVariableValue(v, px, prefix, [excludedKeyRegex]));
        }
        return acc;
      },
      { variables: [], tokens: [] }
    );
  };
  const { variables, tokens } = _toVariables(theme3, prefix);
  return {
    value: variables,
    tokens,
    declarations: variables.join(""),
    css: getRule(selector, variables.join(""))
  };
}
var themeUtils_default = {
  regex: {
    rules: {
      class: {
        pattern: /^\.([a-zA-Z][\w-]*)$/,
        resolve(value) {
          return { type: "class", selector: value, matched: this.pattern.test(value.trim()) };
        }
      },
      attr: {
        pattern: /^\[(.*)\]$/,
        resolve(value) {
          return { type: "attr", selector: `:root${value}`, matched: this.pattern.test(value.trim()) };
        }
      },
      media: {
        pattern: /^@media (.*)$/,
        resolve(value) {
          return { type: "media", selector: `${value}{:root{[CSS]}}`, matched: this.pattern.test(value.trim()) };
        }
      },
      system: {
        pattern: /^system$/,
        resolve(value) {
          return { type: "system", selector: "@media (prefers-color-scheme: dark){:root{[CSS]}}", matched: this.pattern.test(value.trim()) };
        }
      },
      custom: {
        resolve(value) {
          return { type: "custom", selector: value, matched: true };
        }
      }
    },
    resolve(value) {
      const rules = Object.keys(this.rules).filter((k) => k !== "custom").map((r) => this.rules[r]);
      return [value].flat().map((v) => {
        var _a;
        return (_a = rules.map((r) => r.resolve(v)).find((rr) => rr.matched)) != null ? _a : this.rules.custom.resolve(v);
      });
    }
  },
  _toVariables(theme3, options) {
    return toVariables_default(theme3, { prefix: options == null ? void 0 : options.prefix });
  },
  getCommon({ name = "", theme: theme3 = {}, params, set, defaults }) {
    var _c, _d, _e, _f;
    const { preset, options } = theme3;
    let primitive_css, primitive_tokens, semantic_css, semantic_tokens;
    if (isNotEmpty(preset)) {
      const { primitive, semantic } = preset;
      const _a = semantic || {}, { colorScheme } = _a, sRest = __objRest(_a, ["colorScheme"]);
      const _b = colorScheme || {}, { dark } = _b, csRest = __objRest(_b, ["dark"]);
      const prim_var = isNotEmpty(primitive) ? this._toVariables({ primitive }, options) : {};
      const sRest_var = isNotEmpty(sRest) ? this._toVariables({ semantic: sRest }, options) : {};
      const csRest_var = isNotEmpty(csRest) ? this._toVariables({ light: csRest }, options) : {};
      const dark_var = isNotEmpty(dark) ? this._toVariables({ dark }, options) : {};
      const [prim_css, prim_tokens] = [(_c = prim_var.declarations) != null ? _c : "", prim_var.tokens];
      const [sRest_css, sRest_tokens] = [(_d = sRest_var.declarations) != null ? _d : "", sRest_var.tokens || []];
      const [csRest_css, csRest_tokens] = [(_e = csRest_var.declarations) != null ? _e : "", csRest_var.tokens || []];
      const [dark_css, dark_tokens] = [(_f = dark_var.declarations) != null ? _f : "", dark_var.tokens || []];
      primitive_css = this.transformCSS(name, prim_css, "light", "variable", options, set, defaults);
      primitive_tokens = prim_tokens;
      const semantic_light_css = this.transformCSS(name, `${sRest_css}${csRest_css}color-scheme:light`, "light", "variable", options, set, defaults);
      const semantic_dark_css = this.transformCSS(name, `${dark_css}color-scheme:dark`, "dark", "variable", options, set, defaults);
      semantic_css = `${semantic_light_css}${semantic_dark_css}`;
      semantic_tokens = [.../* @__PURE__ */ new Set([...sRest_tokens, ...csRest_tokens, ...dark_tokens])];
    }
    return {
      primitive: {
        css: primitive_css,
        tokens: primitive_tokens
      },
      semantic: {
        css: semantic_css,
        tokens: semantic_tokens
      }
    };
  },
  getPreset({ name = "", preset = {}, options, params, set, defaults, selector }) {
    var _c, _d, _e;
    const _name = name.replace("-directive", "");
    const _a = preset, { colorScheme } = _a, vRest = __objRest(_a, ["colorScheme"]);
    const _b = colorScheme || {}, { dark } = _b, csRest = __objRest(_b, ["dark"]);
    const vRest_var = isNotEmpty(vRest) ? this._toVariables({ [_name]: vRest }, options) : {};
    const csRest_var = isNotEmpty(csRest) ? this._toVariables({ [_name]: csRest }, options) : {};
    const dark_var = isNotEmpty(dark) ? this._toVariables({ [_name]: dark }, options) : {};
    const [vRest_css, vRest_tokens] = [(_c = vRest_var.declarations) != null ? _c : "", vRest_var.tokens || []];
    const [csRest_css, csRest_tokens] = [(_d = csRest_var.declarations) != null ? _d : "", csRest_var.tokens || []];
    const [dark_css, dark_tokens] = [(_e = dark_var.declarations) != null ? _e : "", dark_var.tokens || []];
    const tokens = [.../* @__PURE__ */ new Set([...vRest_tokens, ...csRest_tokens, ...dark_tokens])];
    const light_variable_css = this.transformCSS(_name, `${vRest_css}${csRest_css}`, "light", "variable", options, set, defaults, selector);
    const dark_variable_css = this.transformCSS(_name, dark_css, "dark", "variable", options, set, defaults, selector);
    return {
      css: `${light_variable_css}${dark_variable_css}`,
      tokens
    };
  },
  getPresetC({ name = "", theme: theme3 = {}, params, set, defaults }) {
    var _a;
    const { preset, options } = theme3;
    const cPreset = (_a = preset == null ? void 0 : preset.components) == null ? void 0 : _a[name];
    return this.getPreset({ name, preset: cPreset, options, params, set, defaults });
  },
  getPresetD({ name = "", theme: theme3 = {}, params, set, defaults }) {
    var _a;
    const dName = name.replace("-directive", "");
    const { preset, options } = theme3;
    const dPreset = (_a = preset == null ? void 0 : preset.directives) == null ? void 0 : _a[dName];
    return this.getPreset({ name: dName, preset: dPreset, options, params, set, defaults });
  },
  getColorSchemeOption(options, defaults) {
    var _a;
    return this.regex.resolve((_a = options.darkModeSelector) != null ? _a : defaults.options.darkModeSelector);
  },
  getLayerOrder(name, options = {}, params, defaults) {
    const { cssLayer } = options;
    if (cssLayer) {
      const order = resolve(cssLayer.order || "primeui", params);
      return `@layer ${order}`;
    }
    return "";
  },
  getCommonStyleSheet({ name = "", theme: theme3 = {}, params, props = {}, set, defaults }) {
    const common = this.getCommon({ name, theme: theme3, params, set, defaults });
    const _props = Object.entries(props).reduce((acc, [k, v]) => acc.push(`${k}="${v}"`) && acc, []).join(" ");
    return Object.entries(common || {}).reduce((acc, [key, value]) => {
      if (value == null ? void 0 : value.css) {
        const _css = minifyCSS(value == null ? void 0 : value.css);
        const id = `${key}-variables`;
        acc.push(`<style type="text/css" data-primevue-style-id="${id}" ${_props}>${_css}</style>`);
      }
      return acc;
    }, []).join("");
  },
  getStyleSheet({ name = "", theme: theme3 = {}, params, props = {}, set, defaults }) {
    var _a;
    const options = { name, theme: theme3, params, set, defaults };
    const preset_css = (_a = name.includes("-directive") ? this.getPresetD(options) : this.getPresetC(options)) == null ? void 0 : _a.css;
    const _props = Object.entries(props).reduce((acc, [k, v]) => acc.push(`${k}="${v}"`) && acc, []).join(" ");
    return preset_css ? `<style type="text/css" data-primevue-style-id="${name}-variables" ${_props}>${minifyCSS(preset_css)}</style>` : "";
  },
  createTokens(obj = {}, defaults, parentKey = "", parentPath = "", tokens = {}) {
    Object.entries(obj).forEach(([key, value]) => {
      const currentKey = matchRegex(key, defaults.variable.excludedKeyRegex) ? parentKey : parentKey ? `${parentKey}.${toTokenKey(key)}` : toTokenKey(key);
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      if (isObject(value)) {
        this.createTokens(value, defaults, currentKey, currentPath, tokens);
      } else {
        tokens[currentKey] || (tokens[currentKey] = {
          paths: [],
          computed(colorScheme, tokenPathMap = {}) {
            if (colorScheme) {
              const path = this.paths.find((p) => p.scheme === colorScheme) || this.paths.find((p) => p.scheme === "none");
              return path == null ? void 0 : path.computed(colorScheme, tokenPathMap["binding"]);
            }
            return this.paths.map((p) => p.computed(p.scheme, tokenPathMap[p.scheme]));
          }
        });
        tokens[currentKey].paths.push({
          path: currentPath,
          value,
          scheme: currentPath.includes("colorScheme.light") ? "light" : currentPath.includes("colorScheme.dark") ? "dark" : "none",
          computed(colorScheme, tokenPathMap = {}) {
            const regex = /{([^}]*)}/g;
            let computedValue = value;
            tokenPathMap["name"] = this.path;
            tokenPathMap["binding"] || (tokenPathMap["binding"] = {});
            if (matchRegex(value, regex)) {
              const val = value.trim();
              const _val = val.replaceAll(regex, (v) => {
                var _a, _b;
                const path = v.replace(/{|}/g, "");
                return (_b = (_a = tokens[path]) == null ? void 0 : _a.computed(colorScheme, tokenPathMap)) == null ? void 0 : _b.value;
              });
              const calculationRegex = /(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g;
              const cleanedVarRegex = /var\([^)]+\)/g;
              computedValue = matchRegex(_val.replace(cleanedVarRegex, "0"), calculationRegex) ? `calc(${_val})` : _val;
            }
            isEmpty(tokenPathMap["binding"]) && delete tokenPathMap["binding"];
            return {
              colorScheme,
              path: this.path,
              paths: tokenPathMap,
              value: computedValue.includes("undefined") ? void 0 : computedValue
            };
          }
        });
      }
    });
    return tokens;
  },
  getTokenValue(tokens, path, defaults) {
    var _a;
    const normalizePath = (str) => {
      const strArr = str.split(".");
      return strArr.filter((s) => !matchRegex(s.toLowerCase(), defaults.variable.excludedKeyRegex)).join(".");
    };
    const token = normalizePath(path);
    const colorScheme = path.includes("colorScheme.light") ? "light" : path.includes("colorScheme.dark") ? "dark" : void 0;
    const computedValues = [(_a = tokens[token]) == null ? void 0 : _a.computed(colorScheme)].flat().filter((computed) => computed);
    return computedValues.length === 1 ? computedValues[0].value : computedValues.reduce((acc = {}, computed) => {
      const _a2 = computed, { colorScheme: cs } = _a2, rest = __objRest(_a2, ["colorScheme"]);
      acc[cs] = rest;
      return acc;
    }, void 0);
  },
  transformCSS(name, css22, mode, type, options = {}, set, defaults, selector) {
    if (isNotEmpty(css22)) {
      const { cssLayer } = options;
      if (type !== "style") {
        const colorSchemeOption = this.getColorSchemeOption(options, defaults);
        const _css = selector ? getRule(selector, css22) : css22;
        css22 = mode === "dark" ? colorSchemeOption.reduce((acc, { selector: _selector }) => {
          if (isNotEmpty(_selector)) {
            acc += _selector.includes("[CSS]") ? _selector.replace("[CSS]", _css) : getRule(_selector, _css);
          }
          return acc;
        }, "") : getRule(selector != null ? selector : ":root", css22);
      }
      if (cssLayer) {
        const layerOptions = {
          name: "primeui",
          order: "primeui"
        };
        isObject(cssLayer) && (layerOptions.name = resolve(cssLayer.name, { name, type }));
        if (isNotEmpty(layerOptions.name)) {
          css22 = getRule(`@layer ${layerOptions.name}`, css22);
          set == null ? void 0 : set.layerNames(layerOptions.name);
        }
      }
      return css22;
    }
    return "";
  }
};
var config_default = {
  defaults: {
    variable: {
      prefix: "p",
      selector: ":root",
      excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states)$/gi
    },
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false
    }
  },
  _theme: void 0,
  _layerNames: /* @__PURE__ */ new Set(),
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  _loadingStyles: /* @__PURE__ */ new Set(),
  _tokens: {},
  update(newValues = {}) {
    const { theme: theme3 } = newValues;
    if (theme3) {
      this._theme = __spreadProps(__spreadValues2({}, theme3), {
        options: __spreadValues2(__spreadValues2({}, this.defaults.options), theme3.options)
      });
      this._tokens = themeUtils_default.createTokens(this.preset, this.defaults);
      this.clearLoadedStyleNames();
    }
  },
  get theme() {
    return this._theme;
  },
  get preset() {
    var _a;
    return ((_a = this.theme) == null ? void 0 : _a.preset) || {};
  },
  get options() {
    var _a;
    return ((_a = this.theme) == null ? void 0 : _a.options) || {};
  },
  get tokens() {
    return this._tokens;
  },
  getTheme() {
    return this.theme;
  },
  setTheme(newValue) {
    this.update({ theme: newValue });
    service_default.emit("theme:change", newValue);
  },
  getPreset() {
    return this.preset;
  },
  setPreset(newValue) {
    this._theme = __spreadProps(__spreadValues2({}, this.theme), { preset: newValue });
    this._tokens = themeUtils_default.createTokens(newValue, this.defaults);
    this.clearLoadedStyleNames();
    service_default.emit("preset:change", newValue);
    service_default.emit("theme:change", this.theme);
  },
  getOptions() {
    return this.options;
  },
  setOptions(newValue) {
    this._theme = __spreadProps(__spreadValues2({}, this.theme), { options: newValue });
    this.clearLoadedStyleNames();
    service_default.emit("options:change", newValue);
    service_default.emit("theme:change", this.theme);
  },
  getLayerNames() {
    return [...this._layerNames];
  },
  setLayerNames(layerName) {
    this._layerNames.add(layerName);
  },
  getLoadedStyleNames() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded(name) {
    return this._loadedStyleNames.has(name);
  },
  setLoadedStyleName(name) {
    this._loadedStyleNames.add(name);
  },
  deleteLoadedStyleName(name) {
    this._loadedStyleNames.delete(name);
  },
  clearLoadedStyleNames() {
    this._loadedStyleNames.clear();
  },
  getTokenValue(tokenPath) {
    return themeUtils_default.getTokenValue(this.tokens, tokenPath, this.defaults);
  },
  getCommon(name = "", params) {
    return themeUtils_default.getCommon({ name, theme: this.theme, params, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getComponent(name = "", params) {
    const options = { name, theme: this.theme, params, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return themeUtils_default.getPresetC(options);
  },
  getDirective(name = "", params) {
    const options = { name, theme: this.theme, params, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return themeUtils_default.getPresetD(options);
  },
  getCustomPreset(name = "", preset, selector, params) {
    const options = { name, preset, options: this.options, selector, params, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return themeUtils_default.getPreset(options);
  },
  getLayerOrderCSS(name = "") {
    return themeUtils_default.getLayerOrder(name, this.options, { names: this.getLayerNames() }, this.defaults);
  },
  transformCSS(name = "", css22, type = "style", mode) {
    return themeUtils_default.transformCSS(name, css22, mode, type, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
  },
  getCommonStyleSheet(name = "", params, props = {}) {
    return themeUtils_default.getCommonStyleSheet({ name, theme: this.theme, params, props, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getStyleSheet(name, params, props = {}) {
    return themeUtils_default.getStyleSheet({ name, theme: this.theme, params, props, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  onStyleMounted(name) {
    this._loadingStyles.add(name);
  },
  onStyleUpdated(name) {
    this._loadingStyles.add(name);
  },
  onStyleLoaded(event, { name }) {
    if (this._loadingStyles.size) {
      this._loadingStyles.delete(name);
      service_default.emit(`theme:${name}:load`, event);
      !this._loadingStyles.size && service_default.emit("theme:load");
    }
  }
};

// node_modules/@primevue/core/api/index.mjs
var FilterMatchMode = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  IN: "in",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  BETWEEN: "between",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};

// node_modules/@primeuix/utils/dom/index.mjs
function isElement(element) {
  return typeof HTMLElement === "object" ? element instanceof HTMLElement : element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName === "string";
}
function setAttributes(element, attributes = {}) {
  if (isElement(element)) {
    const computedStyles = (rule, value) => {
      var _a, _b;
      const styles = ((_a = element == null ? void 0 : element.$attrs) == null ? void 0 : _a[rule]) ? [(_b = element == null ? void 0 : element.$attrs) == null ? void 0 : _b[rule]] : [];
      return [value].flat().reduce((cv, v) => {
        if (v !== null && v !== void 0) {
          const type = typeof v;
          if (type === "string" || type === "number") {
            cv.push(v);
          } else if (type === "object") {
            const _cv = Array.isArray(v) ? computedStyles(rule, v) : Object.entries(v).map(([_k, _v]) => rule === "style" && (!!_v || _v === 0) ? `${_k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${_v}` : !!_v ? _k : void 0);
            cv = _cv.length ? cv.concat(_cv.filter((c) => !!c)) : cv;
          }
        }
        return cv;
      }, styles);
    };
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        const matchedEvent = key.match(/^on(.+)/);
        if (matchedEvent) {
          element.addEventListener(matchedEvent[1].toLowerCase(), value);
        } else if (key === "p-bind") {
          setAttributes(element, value);
        } else {
          value = key === "class" ? [...new Set(computedStyles("class", value))].join(" ").trim() : key === "style" ? computedStyles("style", value).join(";").trim() : value;
          (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
          element.setAttribute(key, value);
        }
      }
    });
  }
}
function getParentNode(element) {
  if (element) {
    let parent = element.parentNode;
    if (parent && parent instanceof ShadowRoot && parent.host) {
      parent = parent.host;
    }
    return parent;
  }
  return null;
}
function isExist(element) {
  return !!(element !== null && typeof element !== "undefined" && element.nodeName && getParentNode(element));
}
function isClient() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
function setAttribute(element, attribute = "", value) {
  if (isElement(element) && value !== null && value !== void 0) {
    element.setAttribute(attribute, value);
  }
}

// node_modules/@primevue/core/usestyle/index.mjs
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function tryOnMounted(fn) {
  var sync = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (getCurrentInstance()) onMounted(fn);
  else if (sync) fn();
  else nextTick(fn);
}
var _id = 0;
function useStyle(css3) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var isLoaded = ref(false);
  var cssRef = ref(css3);
  var styleRef = ref(null);
  var defaultDocument = isClient() ? window.document : void 0;
  var _options$document = options.document, document2 = _options$document === void 0 ? defaultDocument : _options$document, _options$immediate = options.immediate, immediate = _options$immediate === void 0 ? true : _options$immediate, _options$manual = options.manual, manual = _options$manual === void 0 ? false : _options$manual, _options$name = options.name, name = _options$name === void 0 ? "style_".concat(++_id) : _options$name, _options$id = options.id, id = _options$id === void 0 ? void 0 : _options$id, _options$media = options.media, media = _options$media === void 0 ? void 0 : _options$media, _options$nonce = options.nonce, nonce = _options$nonce === void 0 ? void 0 : _options$nonce, _options$first = options.first, first = _options$first === void 0 ? false : _options$first, _options$onMounted = options.onMounted, onStyleMounted = _options$onMounted === void 0 ? void 0 : _options$onMounted, _options$onUpdated = options.onUpdated, onStyleUpdated = _options$onUpdated === void 0 ? void 0 : _options$onUpdated, _options$onLoad = options.onLoad, onStyleLoaded = _options$onLoad === void 0 ? void 0 : _options$onLoad, _options$props = options.props, props = _options$props === void 0 ? {} : _options$props;
  var stop = function stop2() {
  };
  var load2 = function load3(_css) {
    var _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!document2) return;
    var _styleProps = _objectSpread(_objectSpread({}, props), _props);
    var _name = _styleProps.name || name, _id2 = _styleProps.id || id, _nonce = _styleProps.nonce || nonce;
    styleRef.value = document2.querySelector('style[data-primevue-style-id="'.concat(_name, '"]')) || document2.getElementById(_id2) || document2.createElement("style");
    if (!styleRef.value.isConnected) {
      cssRef.value = _css || css3;
      setAttributes(styleRef.value, {
        type: "text/css",
        id: _id2,
        media,
        nonce: _nonce
      });
      first ? document2.head.prepend(styleRef.value) : document2.head.appendChild(styleRef.value);
      setAttribute(styleRef.value, "data-primevue-style-id", _name);
      setAttributes(styleRef.value, _styleProps);
      styleRef.value.onload = function(event) {
        return onStyleLoaded === null || onStyleLoaded === void 0 ? void 0 : onStyleLoaded(event, {
          name: _name
        });
      };
      onStyleMounted === null || onStyleMounted === void 0 || onStyleMounted(_name);
    }
    if (isLoaded.value) return;
    stop = watch(cssRef, function(value) {
      styleRef.value.textContent = value;
      onStyleUpdated === null || onStyleUpdated === void 0 || onStyleUpdated(_name);
    }, {
      immediate: true
    });
    isLoaded.value = true;
  };
  var unload = function unload2() {
    if (!document2 || !isLoaded.value) return;
    stop();
    isExist(styleRef.value) && document2.head.removeChild(styleRef.value);
    isLoaded.value = false;
  };
  if (immediate && !manual) tryOnMounted(load2);
  return {
    id,
    name,
    el: styleRef,
    css: cssRef,
    unload,
    load: load2,
    isLoaded: readonly(isLoaded)
  };
}

// node_modules/@primevue/core/base/style/index.mjs
function _typeof2(o) {
  "@babel/helpers - typeof";
  return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof2(o);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function ownKeys2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
      _defineProperty2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty2(e, r, t) {
  return (r = _toPropertyKey2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey2(t) {
  var i = _toPrimitive2(t, "string");
  return "symbol" == _typeof2(i) ? i : i + "";
}
function _toPrimitive2(t, r) {
  if ("object" != _typeof2(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof2(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var theme = function theme2(_ref) {
  var dt2 = _ref.dt;
  return "\n* {\n    box-sizing: border-box;\n}\n\n/* Non vue overlay animations */\n.p-connected-overlay {\n    opacity: 0;\n    transform: scaleY(0.8);\n    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),\n        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-visible {\n    opacity: 1;\n    transform: scaleY(1);\n}\n\n.p-connected-overlay-hidden {\n    opacity: 0;\n    transform: scaleY(1);\n    transition: opacity 0.1s linear;\n}\n\n/* Vue based overlay animations */\n.p-connected-overlay-enter-from {\n    opacity: 0;\n    transform: scaleY(0.8);\n}\n\n.p-connected-overlay-leave-to {\n    opacity: 0;\n}\n\n.p-connected-overlay-enter-active {\n    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),\n        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-leave-active {\n    transition: opacity 0.1s linear;\n}\n\n/* Toggleable Content */\n.p-toggleable-content-enter-from,\n.p-toggleable-content-leave-to {\n    max-height: 0;\n}\n\n.p-toggleable-content-enter-to,\n.p-toggleable-content-leave-from {\n    max-height: 1000px;\n}\n\n.p-toggleable-content-leave-active {\n    overflow: hidden;\n    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);\n}\n\n.p-toggleable-content-enter-active {\n    overflow: hidden;\n    transition: max-height 1s ease-in-out;\n}\n\n.p-disabled,\n.p-disabled * {\n    cursor: default;\n    pointer-events: none;\n    user-select: none;\n}\n\n.p-disabled,\n.p-component:disabled {\n    opacity: ".concat(dt2("disabled.opacity"), ";\n}\n\n.pi {\n    font-size: ").concat(dt2("icon.size"), ";\n}\n\n.p-icon {\n    width: ").concat(dt2("icon.size"), ";\n    height: ").concat(dt2("icon.size"), ";\n}\n\n.p-overlay-mask {\n    background: ").concat(dt2("mask.background"), ";\n    color: ").concat(dt2("mask.color"), ";\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-overlay-mask-enter {\n    animation: p-overlay-mask-enter-animation ").concat(dt2("mask.transition.duration"), " forwards;\n}\n\n.p-overlay-mask-leave {\n    animation: p-overlay-mask-leave-animation ").concat(dt2("mask.transition.duration"), " forwards;\n}\n\n@keyframes p-overlay-mask-enter-animation {\n    from {\n        background: transparent;\n    }\n    to {\n        background: ").concat(dt2("mask.background"), ";\n    }\n}\n@keyframes p-overlay-mask-leave-animation {\n    from {\n        background: ").concat(dt2("mask.background"), ";\n    }\n    to {\n        background: transparent;\n    }\n}\n");
};
var css = function css2(_ref2) {
  var dt2 = _ref2.dt;
  return "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n}\n\n.p-hidden-accessible input,\n.p-hidden-accessible select {\n    transform: scale(0);\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n    padding-right: ".concat(dt2("scrollbar.width"), ";\n}\n");
};
var classes = {};
var inlineStyles = {};
var BaseStyle = {
  name: "base",
  css,
  theme,
  classes,
  inlineStyles,
  load: function load(style) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var transform = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(cs) {
      return cs;
    };
    var computedStyle = transform(resolve(style, {
      dt
    }));
    return computedStyle ? useStyle(minifyCSS(computedStyle), _objectSpread2({
      name: this.name
    }, options)) : {};
  },
  loadCSS: function loadCSS() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, options);
  },
  loadTheme: function loadTheme() {
    var _this = this;
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.theme, options, function(computedStyle) {
      return config_default.transformCSS(options.name || _this.name, computedStyle);
    });
  },
  getCommonTheme: function getCommonTheme(params) {
    return config_default.getCommon(this.name, params);
  },
  getComponentTheme: function getComponentTheme(params) {
    return config_default.getComponent(this.name, params);
  },
  getDirectiveTheme: function getDirectiveTheme(params) {
    return config_default.getDirective(this.name, params);
  },
  getPresetTheme: function getPresetTheme(preset, selector, params) {
    return config_default.getCustomPreset(this.name, preset, selector, params);
  },
  getLayerOrderThemeCSS: function getLayerOrderThemeCSS() {
    return config_default.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function getStyleSheet() {
    var extendedCSS = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var _css = resolve(this.css, {
        dt
      });
      var _style = minifyCSS("".concat(_css).concat(extendedCSS));
      var _props = Object.entries(props).reduce(function(acc, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), k = _ref4[0], v = _ref4[1];
        return acc.push("".concat(k, '="').concat(v, '"')) && acc;
      }, []).join(" ");
      return '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(_props, ">").concat(_style, "</style>");
    }
    return "";
  },
  getCommonThemeStyleSheet: function getCommonThemeStyleSheet(params) {
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return config_default.getCommonStyleSheet(this.name, params, props);
  },
  getThemeStyleSheet: function getThemeStyleSheet(params) {
    var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var css3 = [config_default.getStyleSheet(this.name, params, props)];
    if (this.theme) {
      var name = this.name === "base" ? "global-style" : "".concat(this.name, "-style");
      var _css = resolve(this.theme, {
        dt
      });
      var _style = minifyCSS(config_default.transformCSS(name, _css));
      var _props = Object.entries(props).reduce(function(acc, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2), k = _ref6[0], v = _ref6[1];
        return acc.push("".concat(k, '="').concat(v, '"')) && acc;
      }, []).join(" ");
      css3.push('<style type="text/css" data-primevue-style-id="'.concat(name, '" ').concat(_props, ">").concat(_style, "</style>"));
    }
    return css3.join("");
  },
  extend: function extend(style) {
    return _objectSpread2(_objectSpread2({}, this), {}, {
      css: void 0,
      theme: void 0
    }, style);
  }
};

// node_modules/@primevue/core/service/index.mjs
var PrimeVueService = EventBus();

// node_modules/@primeuix/utils/zindex/index.mjs
function handler() {
  let zIndexes = [];
  const generateZIndex = (key, autoZIndex, baseZIndex = 999) => {
    const lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
    const newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
    zIndexes.push({ key, value: newZIndex });
    return newZIndex;
  };
  const revertZIndex = (zIndex) => {
    zIndexes = zIndexes.filter((obj) => obj.value !== zIndex);
  };
  const getCurrentZIndex = (key, autoZIndex) => {
    return getLastZIndex(key, autoZIndex).value;
  };
  const getLastZIndex = (key, autoZIndex, baseZIndex = 0) => {
    return [...zIndexes].reverse().find((obj) => autoZIndex ? true : obj.key === key) || { key, value: baseZIndex };
  };
  const getZIndex = (element) => {
    return element ? parseInt(element.style.zIndex, 10) || 0 : 0;
  };
  return {
    get: getZIndex,
    set: (key, element, baseZIndex) => {
      if (element) {
        element.style.zIndex = String(generateZIndex(key, true, baseZIndex));
      }
    },
    clear: (element) => {
      if (element) {
        revertZIndex(getZIndex(element));
        element.style.zIndex = "";
      }
    },
    getCurrent: (key) => getCurrentZIndex(key, true)
  };
}
var ZIndex = handler();

// node_modules/@primevue/core/config/index.mjs
function _typeof3(o) {
  "@babel/helpers - typeof";
  return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof3(o);
}
function ownKeys3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys3(Object(t), true).forEach(function(r2) {
      _defineProperty3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty3(e, r, t) {
  return (r = _toPropertyKey3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey3(t) {
  var i = _toPrimitive3(t, "string");
  return "symbol" == _typeof3(i) ? i : i + "";
}
function _toPrimitive3(t, r) {
  if ("object" != _typeof3(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof3(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var defaultOptions = {
  ripple: false,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: false,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: false,
  pt: void 0,
  ptOptions: {
    mergeSections: true,
    mergeProps: false
  },
  csp: {
    nonce: void 0
  }
};
var PrimeVueSymbol = Symbol();
function usePrimeVue() {
  var PrimeVue2 = inject(PrimeVueSymbol);
  if (!PrimeVue2) {
    throw new Error("PrimeVue is not installed!");
  }
  return PrimeVue2;
}
function setup(app, options) {
  var PrimeVue2 = {
    config: reactive(options)
  };
  app.config.globalProperties.$primevue = PrimeVue2;
  app.provide(PrimeVueSymbol, PrimeVue2);
  clearConfig();
  setupConfig(app, PrimeVue2);
  return PrimeVue2;
}
var stopWatchers = [];
function clearConfig() {
  service_default.clear();
  stopWatchers.forEach(function(fn) {
    return fn === null || fn === void 0 ? void 0 : fn();
  });
  stopWatchers = [];
}
function setupConfig(app, PrimeVue2) {
  var isThemeChanged = ref(false);
  var loadCommonTheme = function loadCommonTheme2() {
    if (!config_default.isStyleNameLoaded("common")) {
      var _BaseStyle$getCommonT, _PrimeVue$config;
      var _ref = ((_BaseStyle$getCommonT = BaseStyle.getCommonTheme) === null || _BaseStyle$getCommonT === void 0 ? void 0 : _BaseStyle$getCommonT.call(BaseStyle)) || {}, primitive = _ref.primitive, semantic = _ref.semantic;
      var styleOptions = {
        nonce: (_PrimeVue$config = PrimeVue2.config) === null || _PrimeVue$config === void 0 || (_PrimeVue$config = _PrimeVue$config.csp) === null || _PrimeVue$config === void 0 ? void 0 : _PrimeVue$config.nonce
      };
      BaseStyle.load(primitive === null || primitive === void 0 ? void 0 : primitive.css, _objectSpread3({
        name: "primitive-variables"
      }, styleOptions));
      BaseStyle.load(semantic === null || semantic === void 0 ? void 0 : semantic.css, _objectSpread3({
        name: "semantic-variables"
      }, styleOptions));
      BaseStyle.loadTheme(_objectSpread3({
        name: "global-style"
      }, styleOptions));
      config_default.setLoadedStyleName("common");
    }
  };
  service_default.on("theme:change", function(newTheme) {
    if (!isThemeChanged.value) {
      app.config.globalProperties.$primevue.config.theme = newTheme;
      isThemeChanged.value = true;
    }
  });
  var stopConfigWatcher = watch(PrimeVue2.config, function(newValue, oldValue) {
    PrimeVueService.emit("config:change", {
      newValue,
      oldValue
    });
  }, {
    immediate: true,
    deep: true
  });
  var stopRippleWatcher = watch(function() {
    return PrimeVue2.config.ripple;
  }, function(newValue, oldValue) {
    PrimeVueService.emit("config:ripple:change", {
      newValue,
      oldValue
    });
  }, {
    immediate: true,
    deep: true
  });
  var stopThemeWatcher = watch(function() {
    return PrimeVue2.config.theme;
  }, function(newValue, oldValue) {
    if (!isThemeChanged.value) {
      config_default.setTheme(newValue);
    }
    if (!PrimeVue2.config.unstyled) {
      loadCommonTheme();
    }
    isThemeChanged.value = false;
    PrimeVueService.emit("config:theme:change", {
      newValue,
      oldValue
    });
  }, {
    immediate: true,
    deep: true
  });
  var stopUnstyledWatcher = watch(function() {
    return PrimeVue2.config.unstyled;
  }, function(newValue, oldValue) {
    if (!newValue && PrimeVue2.config.theme) {
      loadCommonTheme();
    }
    PrimeVueService.emit("config:unstyled:change", {
      newValue,
      oldValue
    });
  }, {
    immediate: true,
    deep: true
  });
  stopWatchers.push(stopConfigWatcher);
  stopWatchers.push(stopRippleWatcher);
  stopWatchers.push(stopThemeWatcher);
  stopWatchers.push(stopUnstyledWatcher);
}
var PrimeVue = {
  install: function install(app, options) {
    var configOptions = mergeKeys(defaultOptions, options);
    setup(app, configOptions);
  }
};
export {
  clearConfig,
  PrimeVue as default,
  defaultOptions,
  setup,
  setupConfig,
  usePrimeVue
};
//# sourceMappingURL=primevue_config.js.map
