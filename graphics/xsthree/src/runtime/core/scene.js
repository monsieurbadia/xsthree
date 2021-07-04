export const scenefn = _ => (scene());

const scene = _ => ({
  name: "",
  isScene: true,
  children: [],
  add(child) {
    const children = this.children.splice(this.children.length, 0, child);
    return Object.create(this, {children});
  },
});
