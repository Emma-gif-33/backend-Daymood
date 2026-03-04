SELECT
  r.id_user,
  date_trunc('week' :: text, (r.date) :: timestamp WITH time zone) AS week_start,
  e.name AS emotion,
  count(*) AS total
FROM
  (
    records r
    JOIN emotions e ON ((r.id_emotion = e.id))
  )
GROUP BY
  r.id_user,
  (
    date_trunc('week' :: text, (r.date) :: timestamp WITH time zone)
  ),
  e.name
ORDER BY
  (
    date_trunc('week' :: text, (r.date) :: timestamp WITH time zone)
  ) DESC;