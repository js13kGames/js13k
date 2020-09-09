import GameObject from "./gameObject";
import ASSETS from "./assets";

import { clamp, addVectors, getHueRotation } from "./utils";

export default class extends GameObject implements Player {
  vel: Vector = [0, 0];
  item?: GameObject;
  arms: HTMLImageElement;

  maxSpeed = 2;
  acc = 0.2;

  scope = 40;

  constructor(id: string, color: Color, public controller: Controller) {
    super(id, "player", color);

    this.arms = ASSETS.playerArms;

    this.w = ASSETS.playerArms.width;
    this.h = ASSETS.player.height;

    this.hue = getHueRotation(color);
  }

  get rotation() {
    const [dx] = this.vel;
    if (dx > 0) return 0.1;
    if (dx < 0) return -0.1;
    return 0;
  }

  setColor(newColor: Color) {
    let newHue = getHueRotation(newColor);

    if (newHue !== -1) {
      this.hue = newHue;
      super.setColor(newColor);
    } else console.log(`${this.id} cannot be painted in ${newColor}`);
  }

  onResize(scaleTo: number) {
    // this.scale *= scale;
    // this.w *= scale;
    // this.h *= scale;
    super.onResize(scaleTo);

    this.maxSpeed *= scaleTo;
    this.scope *= scaleTo;
  }

  accelerate() {
    if (this.controller.left) this.vel[0] -= this.acc;
    else if (this.controller.right) this.vel[0] += this.acc;
    else this.vel[0] = 0;

    if (this.controller.up) this.vel[1] -= this.acc;
    else if (this.controller.down) this.vel[1] += this.acc;
    else this.vel[1] = 0;

    let s = this.maxSpeed;
    this.vel[0] = clamp(-s, s, this.vel[0]);
    this.vel[1] = clamp(-s, s, this.vel[1]);
  }

  move() {
    this.pos = addVectors(this.pos, this.vel);

    if (this.item) {
      this.item.pos = [...this.pos];
      this.item.pos[0] += (this.w - this.item.w) / 2;
      this.item.pos[1] -= this.h;
    }
  }

  pickItem(item: GameObject) {
    console.log(`${this.id} picked ${item.id}`);

    item.owner = this;
    item.active = true;
    item.offset = this.offset;
    item.offsetDirection = this.offsetDirection;

    this.item = item;
  }

  releaseItem(isActive = true): GameObject {
    const item = this.item;
    item.active = isActive;
    item.owner = null;

    this.item = null;
    console.log(`${this.id} released ${item.id}`);

    return item;
  }

  update(level?: GameObject[]) {
    this.accelerate();
    this.move();
    this.updateOffset();

    if (this.controller.action) {
      this.controller.action = false;

      const [target, dist] = this.getClosestObject(level);
      if (dist < this.scope) target.onAction(this);
    }

    if (this.item && this.controller.release) this.releaseItem();

    return this;
  }

  renderDetails(ctx: Ctx) {
    if (this.item) {
      // raise hands
      ctx.translate(0, this.h * 0.5);
      ctx.scale(1, -1);
    } else {
      ctx.translate(0, this.h * 0.25);
    }
    ctx.drawImage(this.arms, 0, 0);
  }
}
