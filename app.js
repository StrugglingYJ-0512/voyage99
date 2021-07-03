/*
const express = require("express");

const app = express();
const router = express.Router(); // 미니앱이라 부름. 독립된 router 기능.

router.get("/", (req, res) => {
  res.send("Hi!");
});

// /api 경로가 붙어 있어야만, 뒤의 express.json(), router가 만날수 있다.
// ->  위의 router.get으로 가서, Hi!가 출력됨.
app.use("/api", express.json(), router);

app.listen(8082, () => {
  console.log("서버가 켜졌어요!");
});
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

// 비관계형 데이터베이스로 밑의 주소 없어도 됨.
mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

//할일 리소스 가져오기. 경로는 항상 복수형으로 권장. 
router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();
  //findOne(); 하나만 가져오기, find(); 전부 가져오기
  // -order; order를 내림차순
  // exec(); premis이므로 await을 해 줘야만 한다. 
  res.send({ todos });


});

// 입력된 값 가져오기.
router.post("/todos", async (req, res) => { // 핸들러 ; 비동기 함수
  const { value } = req.body;
  const maxOrderTodo = await Todo.findOne().sort("-order").exec(); // -order ; 오더를 기준으로 내림차순
  let order = 1; // 순서대로 하나씩 쌓으려면.. 제일 큰 숫자 위에 쌓아야 함.

  if (maxOrderTodo) {
    order = maxOrderTodo.order + 1;
  }

  const todo = new Todo({ value, order });
  await todo.save();

  res.send({ todo });
});

// order 값을 서로 바꾼다. up/down 버튼 누를떄.
router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, value, done } = req.body;

  const todo = await Todo.findById(todoId).exec();

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = todo.order;
      await targetTodo.save();
    }
    todo.order = order;
  } else if (value) { // ????
    todo.value = value;
  } else if (done !== undefined) {
    todo.doneAt = done ? new Date() : null;
  }
  await todo.save();

  res.send({}); // 응답은 무조건 내줘야 한다. 
})

router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();
  await todo.delete();

  res.send({});
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8082, () => {
  console.log("서버가 켜졌어요!");
});
