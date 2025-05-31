function Match(id, user_id, result, collected_cards, terminated, date) {
  this.id = id;
  this.user_id = user_id;
  this.result = result;
  this.collected_cards = collected_cards;
  this.terminated = terminated;
  this.date = date;
}

function Situation(id, name, misfortune_index, img_path) {
  this.id = id;
  this.name = name;
  this.misfortune_index = misfortune_index;
  this.img_path = img_path;
}

function SituationInMatch(situation_id, match_id, round, resut) {
  this.situation_id = situation_id;
  this.match_id = match_id;
  this.round = round;
  this.result = resut;
}

export { Match, Situation, SituationInMatch };