import GameObject from "./gameObject";

class Modifier extends GameObject {
  w = 32;
  h = 32;

  constructor(id: string, type: string, actionCommand: Command, color?: Color) {
    super(id, type, color || "lightblue");
    this.onAction = (player: Player) => actionCommand(player);
  }
}

export function createItemProvider(itemId: string, level: Item[]): Modifier {
  const command = (player: Player) => {
    if (player.item) {
      console.log(`${player.id} already has an item!`);
      return;
    }
    let newItem = new GameObject(itemId, "item", "white");
    player.pickItem(newItem);
    level.unshift(newItem);
  };

  return new Modifier(itemId, "provider", command);
}

export function createPainter(color: Color): Modifier {
  const command: Command = (player: Player) => {
    if (!player.item) {
      console.log(`${player.id} does not have an item!`);
      return;
    }

    player.item.color = color;
    console.log(`${player.id} painted ${player.item.id} in ${color}`);
  };

  let id = typeof color === "string" ? color : "painter";
  return new Modifier(id, "painter", command, color);
}
