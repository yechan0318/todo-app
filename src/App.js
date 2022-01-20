import React, { useReducer, useState, useRef, useCallback } from 'react';
import TodoTemplate from './components/TodoTemplate';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';

/* 최적화
느려지는 원인
1. 자신이 전달받은 props가 변결될 때
2. 자신의 state가 변경 될 때
3. 부모 컴포넌트가 리렌더링될 때
4. forceUpdate 함수가 실행될 때
함수형 업데이트 / Reducer 
*/

function createBulkTodos(){
  const array =[];
  for (let i =1; i <=2500; i++){
    array.push({
      id: i,
      text: `할 일 ${i}`,
      checked: false,
    });
  }
  return array;
}



//Reducer
function todoReducer(todos, action){
  switch(action.type){
    case 'INSERT': //새로추가
    // {type: 'INSERT', todo:{ id:1, text: 'todo', checked: false}}
    return todos.concat(action.todo);
    case 'REMOVE': //제거
    // {type: 'REMOVE', id:1}
    return todos.filter(todo => todo.id !== action.id);
    case 'TOGGLE': //토글
    // {type: 'TOGGLE', id:1}
    return todos.map(todo =>
      todo.id === action.id ? {...todo, checked: !todo.checked } : todo,);
      default:
        return todos;
  }
}


const App = () => {
  const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);

  //고윳값으로 사용될 id
  //ref를 사용하여 변수 담기
  const nextId = useRef(2501);

  const onInsert = useCallback(text => {
    const todo = {
      id: nextId.current,
      text,
      checked: false,
    };
    dispatch({ type: 'INSERT', todo});
    nextId.current += 1; //nextId 1씩 더하기
  },[]);
  const onRemove = useCallback(id => {
    dispatch({ type: 'REMOVE', id});
  },[]);
  const onToggle = useCallback(id => {
    dispatch({type: 'TOGGLE', id });
  },[]);

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
};






/* 함수형 업데이트
  //고유값으로 사용될 id
  //ref를 사용하여 변수 담기
  const nextId = useRef(4);

  const App = () => {
  
  const [todos, setTodos] = useState([
    {
      id:1,
      text: '리액트의 기초 알아보기',
      checked: true,
    },
    {
      id:2,
      text: '컴포넌트 스타일링해 보기',
      checked: true,
    },
    {
      id:3,
      text: '일정 관리 앱 만들어 보기',
      checked: false
    },
  ]);


  const onInsert = useCallback(
    text => {
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      setTodos(todos => todos.concat(todo));
      nextId.current += 1; //nextId 1씩 더하기
    },
    [],
  );

  const onRemove = useCallback(
    id => {
      setTodos(todos => todos.filter(todo => todo.id !==id));
    },
    [],
  );
  
  const onToggle = useCallback(
    id => {
      setTodos(todos => 
        todos.map(todo =>
          todo.id === id ? {...todo, checked: !todo.checked} : todo, 
          ),
      );
    },
    [],
  );

  return (
  <TodoTemplate>
    <TodoInsert onInsert={onInsert} />
    <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle}/>
  </TodoTemplate>
  );
};
*/

export default App;

/*
1.TodoTemplate: 화면을 가운데에 정렬시켜 주며, 앱 타이틀(일정 관리)을 보여 줍니다. childrean으로 내부 JSX를 props로 받아 와서 랜더링 해줍니다.
2.TodoInsert: 새로운 항목을 입력하고 추가할 수 있는 컴포넌트입니다. state를 통해 인풋의 상태를 관리합니다.
3.TodoListItem: 각 할 일 항목에 대한 정보를 보여 주는 컴포넌트입니다. todo 객체를 props로 받아 와서 상태에 따라 다른 스타일의 UI를 보여 줍니다.
4.TodoList: todos 배열을 props로 받아 온 후, 이를 배열 내장 함수 map을 사용해서 여러 개의 TodoListItem 컴포넌트로 변환하여 보여 줍니다.
*/
