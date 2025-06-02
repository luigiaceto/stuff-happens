function Match(id, user_id, result, collected_cards, terminated, date) {
  this.id = id;
  this.user_id = user_id;
  this.result = result;
  this.collected_cards = collected_cards;
  this.terminated = terminated;
  this.date = date;
}

// exploit the Situation model both to exchange data about the situation and
// the situation in a match
function Situation(id, name, misfortune_index, img_path, match_id=null, round=null, result=null) {
  this.id = id;
  this.name = name;
  this.misfortune_index = misfortune_index;
  this.img_path = img_path;
  this.match_id = match_id;
  this.round = round;
  this.result = result;
}

export { Match, Situation };