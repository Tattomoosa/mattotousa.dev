+++
title = "New stuff (to me) in C#"
date = 2021-09-13
draft = true
[extra]
lead = "The switch expression is beautiful..."
+++

C# got something like match syntax! I don't know when this was added but it's great!

```c#
private Vector3 GetDirectionVector()
{
    return targetCollider.direction switch
    {
        0 => Vector3.right,
        1 => Vector3.up,
        2 => Vector3.forward,
        _ => Vector3.zero
    };
}
```
