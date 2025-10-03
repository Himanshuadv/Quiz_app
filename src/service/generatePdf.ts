import jsPDF from "jspdf";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  description?: string;
  id?: number | string;
}

export interface QuizMeta {
  topic: string;
  score: number;
  total: number;
  date: string; // preformatted or ISO
  duration?: string;
  difficulty?: string;
}

export function generatePDF(meta: QuizMeta, questions: Question[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" }); // A4: 595 x 842 pt
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Layout constants
  const MARGIN = 40;
  const CONTENT_WIDTH = pageWidth - MARGIN * 2;
  const LINE_HEIGHT = 16;
  const SMALL_LINE = 14;
  const CARD_PADDING_V = 12;
  const CARD_PADDING_H = 12;
  const CARD_GAP = 10;
  const SECTION_GAP = 14;
  const HEADER_GAP = 16;
  const FOOTER_HEIGHT = 24;

  let cursorY = MARGIN;

  // Helpers
  const ensurePageSpace = (needed: number) => {
    if (cursorY + needed > pageHeight - MARGIN - FOOTER_HEIGHT) {
      doc.addPage();
      cursorY = MARGIN;
    }
  };

  const split = (text: string, width: number, fontSize = 12) => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, width) as string[];
  };

  const measureLinesHeight = (
    text: string,
    maxWidth: number,
    fontSize = 12,
    lineHeight = LINE_HEIGHT
  ) => {
    doc.setFontSize(fontSize);
    const lines = split(text, maxWidth, fontSize);
    return { lines, height: lines.length * lineHeight };
  };

  const addKeyValueRow = (key: string, value: string, x: number, y: number, keyWidth = 90) => {
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);
    doc.text(key, x, y);
    doc.setTextColor(20, 20, 20);
    doc.text(value ?? "-", x + keyWidth, y);
  };

  const addHeader = () => {
    // Title
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    doc.text("Quiz Report", pageWidth / 2, cursorY, { align: "center" });
    cursorY += HEADER_GAP;

    // Metadata
    doc.setFontSize(12);
    const leftX = MARGIN;
    const rightX = MARGIN + CONTENT_WIDTH / 2 + 10;
    const rowH = 16;

    ensurePageSpace(rowH * 3 + 8);

    addKeyValueRow("Topic:", meta.topic, leftX, cursorY);
    if (meta.duration) addKeyValueRow("Duration:", meta.duration, rightX, cursorY);
    cursorY += rowH;

    addKeyValueRow("Score:", `${meta.score} / ${meta.total}`, leftX, cursorY);
    if (meta.difficulty) addKeyValueRow("Difficulty:", meta.difficulty, rightX, cursorY);
    cursorY += rowH;

    addKeyValueRow("Date:", meta.date, leftX, cursorY);
    cursorY += HEADER_GAP;

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(1);
    doc.line(MARGIN, cursorY, pageWidth - MARGIN, cursorY);
    cursorY += SECTION_GAP;
  };

  type MeasuredOption = {
    textLines: string[];
    isCorrect: boolean;
    isChosenWrong: boolean;
    lineHeight: number;
  };

  const measureQuestionCard = (q: Question) => {
    const maxW = CONTENT_WIDTH - CARD_PADDING_H * 2;
    const questionTitle = `Q${(q.id ?? "") !== "" ? q.id : ""}${(q.id ?? "") !== "" ? ":" : ""} ${q.question}`;
    const qTitle = measureLinesHeight(questionTitle, maxW, 13, LINE_HEIGHT);

    const measuredOptions: MeasuredOption[] = q.options.map((opt, idx) => {
      const prefix = String.fromCharCode(65 + idx) + ". ";
      const base = `${prefix}${opt}`;
      const isCorrect = opt === q.correctAnswer;
      const isChosenWrong = q.userAnswer !== q.correctAnswer && opt === q.userAnswer;
      const lines = split(base, maxW - 24, 11);
      return { textLines: lines, isCorrect, isChosenWrong, lineHeight: SMALL_LINE };
    });

    const optionsHeight = measuredOptions.reduce((acc, m) => acc + m.textLines.length * SMALL_LINE, 0);

    const ua = measureLinesHeight(`Your Answer: ${q.userAnswer ?? "Not Answered"}`, maxW, 11, SMALL_LINE);
    const ca = measureLinesHeight(`Correct Answer: ${q.correctAnswer}`, maxW, 11, SMALL_LINE);

    const exp = q.description
      ? measureLinesHeight(`Explanation: ${q.description}`, maxW, 11, SMALL_LINE)
      : { lines: [] as string[], height: 0 };

    const internalGaps = 6 + 4 + 2 + (q.description ? 2 : 0);

    const totalHeight =
      CARD_PADDING_V * 2 + qTitle.height + optionsHeight + ua.height + ca.height + exp.height + internalGaps;

    return { questionTitle, qTitle, measuredOptions, ua, ca, exp, totalHeight, maxW };
  };

  const renderQuestionCard = (q: Question) => {
    const m = measureQuestionCard(q);
    ensurePageSpace(m.totalHeight + CARD_GAP);

    const gotItRight = q.userAnswer && q.userAnswer === q.correctAnswer;

    const cardX = MARGIN;
    const cardY = cursorY;
    const cardW = CONTENT_WIDTH;
    const cardH = m.totalHeight;

    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.8);
    doc.roundedRect(cardX, cardY, cardW, cardH, 8, 8, "FD");

    doc.setFillColor(gotItRight ? 40 : 200, gotItRight ? 180 : 40, 90);
    doc.roundedRect(cardX, cardY, 6, cardH, 8, 8, "F");

    let y = cardY + CARD_PADDING_V;
    let x = cardX + CARD_PADDING_H + 8;

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13);
    doc.text(m.qTitle.lines, x, y);
    y += m.qTitle.height + 6;

    doc.setFontSize(11);
    m.measuredOptions.forEach((opt) => {
      if (opt.isCorrect) doc.setTextColor(20, 150, 80);
      else if (opt.isChosenWrong) doc.setTextColor(200, 50, 50);
      else doc.setTextColor(30, 30, 30);

      opt.textLines.forEach((line, li) => {
        doc.text(line, x, y + li * SMALL_LINE);
      });
      y += opt.textLines.length * SMALL_LINE;
    });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.text(split(`Your Answer: ${q.userAnswer ?? "Not Answered"}`, m.maxW, 11), x, y);
    y += m.ua.height + 2;

    doc.setTextColor(20, 150, 80);
    doc.text(split(`Correct Answer: ${q.correctAnswer}`, m.maxW, 11), x, y);
    y += m.ca.height + 2;

    if (q.description) {
      doc.setTextColor(40, 70, 180);
      doc.text(split(`Explanation: ${q.description}`, m.maxW, 11), x, y);
      y += m.exp.height;
    }

    cursorY += cardH + CARD_GAP;
    doc.setTextColor(20, 20, 20);
  };

  const addFooterOnAllPages = () => {
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      const footerY = pageHeight - MARGIN + 6;
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Generated by Quiz Platform", pageWidth / 2, footerY - 8, { align: "center" });

      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${p} / ${pageCount}`, pageWidth - MARGIN, footerY + 6, { align: "right" });
    }
  };

  // Build PDF
  addHeader();
  questions.forEach((q, i) => renderQuestionCard({ ...q, id: i + 1 }));
  addFooterOnAllPages();

  const safeTopic = meta.topic.replace(/[^\w\-]+/g, "-");
  const fname = `quiz-report-${safeTopic}.pdf`;
  doc.save(fname);
}
