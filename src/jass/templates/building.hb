set u=CreateUnit(p, '{{unit.type}}', {{unit.pos.x}}, {{unit.pos.y}}, {{unit.pos.z}})
{{#if unit.gold}}call SetResourceAmount(u, {{unit.gold}}){{/if}}
