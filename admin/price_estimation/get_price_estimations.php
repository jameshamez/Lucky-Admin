<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../../condb.php';
$conn->select_db('finfinph_lcukycompany');
$conn->set_charset("utf8mb4");

$sql = "SELECT pe.id, pe.estimate_date, pe.customer_id, pe.job_name, pe.product_type, pe.quantity, pe.budget, pe.status, c.line_id, c.customer_name
        FROM price_estimations pe
        LEFT JOIN customers_admin c ON pe.customer_id = c.id
        ORDER BY pe.created_at DESC";

$result = $conn->query($sql);

$estimations = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $estimations[] = array(
            'id' => $row['id'],
            'date' => $row['estimate_date'],
            'customerId' => $row['customer_id'],
            'customerName' => $row['customer_name'] ?? 'N/A', // Prefer customer name, fallback to N/A
            'lineName' => $row['line_id'] ?? '', // Include line_id if available
            'jobName' => $row['job_name'],
            'productType' => $row['product_type'],
            'quantity' => (int)$row['quantity'],
            'price' => (float)$row['budget'], // Mapping budget to 'price' for frontend consistency
            'status' => $row['status']
        );
    }
}

echo json_encode($estimations);

$conn->close();
?>
