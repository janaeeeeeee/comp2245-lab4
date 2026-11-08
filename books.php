<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

$q = $_GET['q'] ?? '';
$q = is_string($q) ? trim($q) : '';
$pattern = '%' . $q . '%';

$sql = 'SELECT books.title, books.author, books.year,
               subjects.name AS subject, books.copies,
               books.copies - books.on_loan AS available
        FROM books
        JOIN subjects ON subjects.id = books.subject_id
        WHERE (books.title LIKE :title OR books.author LIKE :author)
        ORDER BY books.title';

$stmt = $pdo->prepare($sql);
$stmt->execute([':title' => $pattern, ':author' => $pattern]);
echo json_encode($stmt->fetchAll());