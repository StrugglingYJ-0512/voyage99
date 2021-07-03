const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({ //클래스
  value: String, // 할 일에 입력하는 값.
  doneAt: Date, // 체크를 할 때, 체크를 언제 했는지 // 체크했으면 : date값, 안했으면 null
  order: Number, // order의 쌓이는 순서.
});

// mongoose에서 _id 를 갖다 쓰기 위한 형식. 
TodoSchema.virtual("todoId").get(function () {
  return this._id.toHexString(); // 몽고DB에서는 _id로 고유 id 를 가지고 있어, 사용가능. 가이드virtual 참조
});
TodoSchema.set("toJSON", { // Todo모델이 Json형태로 변환 될 때,virtual 스키마를 포함한다. // 문서참조. 
  virtuals: true,
})

module.exports = mongoose.model("Todo", TodoSchema);


