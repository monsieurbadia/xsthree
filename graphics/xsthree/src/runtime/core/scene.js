export const scenefn = () => (scene());

const scene = () => ({
  name: "",
  isScene: true,
  children: [],
  add(child) {
    const children = this.children.splice(this.children.length, 0, child);
    return Object.create(this, {children});
  },
});
