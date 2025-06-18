function Match(id, user_id, result, round, terminated, date) {
  this.id = id;
  this.user_id = user_id;
  this.result = result;
  this.round = round;
  this.terminated = terminated;
  this.date = date;
}

// il timestamp non mi serve quando restituisco una situazione dunque non lo includo nell'oggetto.
// uso questo oggetto per modellare sia la situazione che la situazione della cronologia della partita
// che è arricchita con altre info
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