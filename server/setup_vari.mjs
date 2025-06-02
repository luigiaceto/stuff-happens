import db from './db.mjs';
import * as MatchDAO from './dao/matchDAO.mjs';
import * as SituationDAO from './dao/situationDAO.mjs';
import { Match, Situation } from './models.mjs';

async function main() {
  const sit1 = new Situation(0, "sit1", 1, "img/sit1.png");
  await SituationDAO.addSituation(sit1);
  const sit2 = new Situation(1, "sit2", 2, "img/sit2.png");
  await SituationDAO.addSituation(sit2);
  const sit3 = new Situation(2, "sit3", 3, "img/sit3.png");
  await SituationDAO.addSituation(sit3);
  const sit4 = new Situation(3, "sit4", 4, "img/sit4.png");
  await SituationDAO.addSituation(sit4);
  const sit5 = new Situation(4, "sit5", 5, "img/sit5.png");
  await SituationDAO.addSituation(sit5);
  const sit6 = new Situation(5, "sit6", 6, "img/sit6.png");
  await SituationDAO.addSituation(sit6);
  const sit7 = new Situation(6, "sit7", 7, "img/sit7.png");
  await SituationDAO.addSituation(sit7);

  db.close();
}

main();