'use strict';

/**
 * Создать пустое игровое поле
 * @returns {number[][]} - двумерный массив
 */
function GetBlankField() {
    return [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
}

/**
 * Добавить число (2 с вероятностью 90% или 4 с вероятностью 10%) в пустую клетку игрового поля
 * @param Field - принимает игровое поле
 */
function AddNumber(Field) {
    let Positions = [];

    for(let i = 0; i < Field.length; i++) {
        for(let j = 0; j < Field[i].length; j++) {
            if(Field[i][j] === 0) {
                Positions.push([i, j]);
            }
        }
    }

    let Position = [];
    if(Positions.length !== 0)
        Position = Positions[Math.round(Math.random() * (Positions.length - 1))];

    GameGrid[Position[0]][Position[1]] = (Math.random() < 0.9) ? 2 : 4;
}

/**
 * Обновить клетки в браузере
 * @param Field - принимает игровое поле
 */
function AddCell(Field) {
    let CellsArray = document.getElementsByClassName("thing");

    ClearField(CellsArray);

    for(let i = 0; i < Field.length; i++) {
        for (let j = 0; j < Field[i].length; j++) {
            if(Field[i][j] !== 0) {
                let PlayField = document.getElementById("playfield");
                let Cell = document.createElement("div");
                Cell.className = "thing t" + Field[i][j];
                Cell.style.top = i * 100 + "px";
                Cell.style.left = j * 100 + "px";

                PlayField.appendChild(Cell);
            }
        }
    }
}

/**
 * Очистить все игровые клетки
 * @param CellsArray - принимает массив клеток
 */
function ClearField(CellsArray) {
    while (CellsArray.length > 0)
        CellsArray[0].remove();
}

/**
 * Создает копию поля
 * @param Field - принимает игровое поле
 * @returns {number[][]} - возвращает копию поля
 */
function GetCopyField(Field) {
    let Result = GetBlankField();

    for(let i = 0; i < Field.length; i++) {
        for(let j = 0; j < Field[i].length; j++) {
            Result[i][j] = Field[i][j];
        }
    }

    return Result;
}

/**
 * Сравнивает два поля друг с другом
 * @param FirstField - Первое поле
 * @param SecondField - Второе поле
 * @returns {boolean} - возращает true если изменение есть, если изменения нету, возвращает false
 */
function CompareField(FirstField, SecondField) {
    for(let i = 0; i < FirstField.length; i++) {
        for (let j = 0; j < FirstField[i].length; j++) {
            if(FirstField[i][j] !== SecondField[i][j])
                return true;
        }
    }

    return false;
}

/**
 * Переворот поля по строкам
 * @param Field - принимает игровое поле
 */
function FlipField(Field) {
    for(let i = 0; i < Field.length; i++)
        Field[i] = Field[i].reverse();
}

/**
 * Вращает поле против часовой стрелке
 * @param Field - принимает игровое поле
 * @returns {number[][]} - возвращает повернутое поле
 */
function GetRotateField(Field) {
    let Result = GetBlankField();

    for(let i = 0; i < Field.length; i++) {
        for(let j = 0; j < Field[i].length; j++) {
            Result[i][j] = Field[Field[i].length - j - 1][i];
        }
    }

    return Result;
}

/**
 * Сдвишает все числа в строке вправо
 * @param Row - принимает строку
 * @returns {number[]} - возращает строку со сдвинутыми элементами
 */
function SlideRow(Row) {
    let Save = Row.filter(Value => Value);
    let Result = Array(Row.length - Save.length).fill(0);
    Result = Result.concat(Save);
    return Result;
}

/**
 * Комбинирует одинаковые элементы, стоящие рядом, в строке
 * @param Row - принимает строку
 * @returns {number[]} - вохвращает измененную строку
 */
function CombineRow(Row) {
    for(let i = Row.length - 1; i > 0; i--) {
        if(Row[i] === Row[i - 1] && Row[i] !== 0) {
            Row[i] = Row[i] + Row[i];
            Row[i - 1] = 0;
            GameScore += Row[i];
        }
    }

    return Row;
}